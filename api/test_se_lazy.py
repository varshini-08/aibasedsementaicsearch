from .search_engine import SearchEngine
import time

print("Initializing SearchEngine (should be fast now)...")
start = time.time()
se = SearchEngine()
print(f"Initialized in {time.time() - start:.2f} seconds")

print("\nPerforming first search (should be slow, loading model)...")
start = time.time()
results = se.semantic_search("peaceful beaches")
print(f"First search done in {time.time() - start:.2f} seconds")
print(f"Found {len(results)} results.")
for r in results[:3]:
    print(r)

print("\nPerforming second search (should be fast)...")
start = time.time()
results = se.semantic_search("ancient temples")
print(f"Second search done in {time.time() - start:.2f} seconds")
