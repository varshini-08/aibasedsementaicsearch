import time
import sys

def test_import(module_name):
    print(f"Importing {module_name}...", end=" ", flush=True)
    start = time.time()
    try:
        __import__(module_name)
        print(f"Done in {time.time() - start:.2f}s")
    except Exception as e:
        print(f"FAILED: {e}")

test_import("contextlib")
test_import("fastapi")
test_import("pandas")
test_import("faiss")
test_import("sqlite3")
test_import("numpy")
test_import("sentence_transformers")
test_import("query_analyzer")
test_import("ranking")
test_import("search_engine")
