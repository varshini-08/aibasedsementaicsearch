import time
print("Importing sentence_transformers...")
start = time.time()
from sentence_transformers import SentenceTransformer
print(f"Imported in {time.time() - start:.2f} seconds")
