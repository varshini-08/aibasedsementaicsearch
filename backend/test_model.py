from sentence_transformers import SentenceTransformer
import time

print("Starting model load...")
start = time.time()
model = SentenceTransformer('all-MiniLM-L6-v2')
print(f"Model loaded in {time.time() - start:.2f} seconds")

print("Encoding test sentence...")
start = time.time()
embedding = model.encode(["Hello world"])
print(f"Encoding done in {time.time() - start:.2f} seconds")
print(f"Embedding shape: {embedding.shape}")
