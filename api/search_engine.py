import pandas as pd
import sqlite3
import numpy as np
import os
from embeddings import Embedder

class SearchEngine:
    def __init__(self, csv_path=None):
        if csv_path is None:
            # Get the directory of the current file (api/)
            base_dir = os.path.dirname(os.path.abspath(__file__))
            csv_path = os.path.join(base_dir, 'dataset', 'tamil_nadu_places.csv')
        self.csv_path = csv_path
        self.df = pd.read_csv(csv_path)
        self.index = None
        self.db_path = 'search_cache.db'
        self.embedder = Embedder()
        self._initialize_faiss()
        self._initialize_fts5()

    def _initialize_faiss(self):
        """
        Create and populate FAISS index using place_name + description + keywords + category.
        """
        import faiss
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
        print(f"FAISS index initialized with {len(texts)} entries.")

    def _initialize_fts5(self):
        """
        Create and populate SQLite FTS5 table for keyword search.
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
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
