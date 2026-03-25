import pandas as pd
import sqlite3
import numpy as np
import os
from .embeddings import Embedder

class SearchEngine:
    def __init__(self, csv_path=None):
        if csv_path is None:
            # Get the directory: d:\aluminiproject\api\dataset
            api_dir = os.path.dirname(os.path.abspath(__file__))
            csv_path = os.path.join(api_dir, 'dataset', 'tamil_nadu_places.csv')
        self.csv_path = csv_path
        print(f"CSV path: {self.csv_path}")
        print(f"CSV exists: {os.path.exists(self.csv_path)}")
        self.api_dir = os.path.dirname(os.path.abspath(csv_path)) # Actually api/dataset
        self.api_root = os.path.dirname(self.api_dir) # api/
        print(f"API root: {self.api_root}")
        
        self.df = pd.read_csv(csv_path)
        print(f"Loaded {len(self.df)} rows from CSV")
        self.index = None
        self.db_path = os.path.join(self.api_root, 'search_cache.db')
        self.vector_store_dir = os.path.join(self.api_root, 'vector_store')
        self.faiss_index_path = os.path.join(self.vector_store_dir, 'index.faiss')
        print(f"DB path: {self.db_path}")
        print(f"FAISS path: {self.faiss_index_path}")
        print(f"DB exists: {os.path.exists(self.db_path)}")
        print(f"FAISS exists: {os.path.exists(self.faiss_index_path)}")
        
        # Ensure vector store directory exists
        os.makedirs(self.vector_store_dir, exist_ok=True)
        
        self.embedder = Embedder()
        self._initialize_faiss()
        self._initialize_fts5()

    def _initialize_faiss(self):
        """
        Load FAISS index from disk or create it if it doesn't exist.
        """
        import faiss
        
        if os.path.exists(self.faiss_index_path):
            print(f"Loading FAISS index from {self.faiss_index_path}...")
            try:
                self.index = faiss.read_index(self.faiss_index_path)
                print(f"FAISS index loaded with {self.index.ntotal} entries.")
                return
            except Exception as e:
                print(f"Error loading FAISS index: {e}. Rebuilding...")

        print("Building FAISS index from scratch...")
        # Combine name, description, keywords and category for embedding as requested
        texts = self.df.apply(
            lambda row: f"{row['place_name']} {row['description']} {row['keywords']} {row['category']}", 
            axis=1
        ).tolist()
        embeddings = self.embedder.get_embeddings_batch(texts)
        
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        # Ensure it's float32 for FAISS
        self.index.add(np.array(embeddings).astype('float32'))
        
        # Save index
        faiss.write_index(self.index, self.faiss_index_path)
        print(f"FAISS index initialized and saved to {self.faiss_index_path}.")

    def _initialize_fts5(self):
        """
        Initialize SQLite FTS5 table only if it's missing or empty.
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Check if table exists and has data
        table_exists = False
        try:
            cursor.execute("SELECT count(*) FROM places_fts")
            count = cursor.fetchone()[0]
            if count == len(self.df):
                table_exists = True
        except sqlite3.OperationalError:
            pass

        if table_exists:
            print("FTS5 table already exists and is up to date.")
            conn.close()
            return

        print("Populating FTS5 table...")
        # Drop if exists and create FTS5 table
        cursor.execute("DROP TABLE IF EXISTS places_fts")
        cursor.execute("""
            CREATE VIRTUAL TABLE places_fts USING fts5(
                id UNINDEXED,
                place_name,
                description,
                keywords,
                category
            )
        """)
        
        # Insert data
        for i, row in self.df.iterrows():
            cursor.execute(
                "INSERT INTO places_fts (id, place_name, description, keywords, category) VALUES (?, ?, ?, ?, ?)",
                (i, row['place_name'], row['description'], row['keywords'], row['category'])
            )
        
        conn.commit()
        conn.close()
        print("FTS5 table initialized.")

    def semantic_search(self, query, top_k=20):
        """
        Perform FAISS search and return scores and original indices.
        """
        query_vector = self.embedder.get_embedding(query)
        distances, indices = self.index.search(np.array([query_vector]).astype('float32'), top_k)
        
        # Convert distances to similarity scores (0-1 range roughly)
        # For L2, smaller distance = more similar. We normalize/invert it.
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            score = 1 / (1 + dist) # Simple normalization
            results.append({"id": int(idx), "semantic_score": float(score)})
        return results

    def keyword_search(self, query):
        """
        Perform SQLite FTS5 search and return BM25-like rankings.
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Note: SQLite FTS5 rank is better if lower. We'll invert it or use it as is.
        # sqlite fts5 rank: lower is better.
        # We sanitize the query for FTS5 by removing special characters that might break MATCH
        sanitized_query = "".join([c if c.isalnum() or c.isspace() else " " for c in query]).strip()
        if not sanitized_query:
            return []
            
        try:
            cursor.execute("""
                SELECT id, rank FROM places_fts 
                WHERE places_fts MATCH ? 
                ORDER BY rank LIMIT 20
            """, (sanitized_query,))
            rows = cursor.fetchall()
        except Exception:
            rows = []
        
        conn.close()
        
        results = []
        for row in rows:
            # Normalize rank - lower rank (more negative) is better in FTS5
            # We invert it for a positive score where higher is better
            score = abs(row[1]) if row[1] < 0 else 1/(1+row[1])
            results.append({"id": int(row[0]), "keyword_score": float(score)})
        return results

# No singleton instance here—initialize in main.py lifespan
