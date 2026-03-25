import numpy as np

class Embedder:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        """
        Initialize the sentence transformer model placeholder.
        """
        self.model_name = model_name
        self.model = None
    
    def _ensure_model(self):
        if self.model is None:
            print(f"Loading SentenceTransformer model: {self.model_name} (this may take a few seconds on first run)...")
            # Lazy import to avoid import-time hanging
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer(self.model_name)
            print(f"Model {self.model_name} loaded successfully.")

    def get_embedding(self, text):
        """
        Convert text into a vector embedding.
        """
        self._ensure_model()
        if not text:
            return np.zeros(self.model.get_sentence_embedding_dimension())
        return self.model.encode(text)

    def get_embeddings_batch(self, texts):
        """
        Convert a list of texts into a list of vector embeddings.
        """
        self._ensure_model()
        return self.model.encode(texts)

# No singleton instance here—initialize in search_engine.py or main.py
