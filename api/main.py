import contextlib
from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from query_analyzer import preprocess_text
# The SearchEngine is imported but will be initialized lazily or via lifespan
from search_engine import SearchEngine
from ranking import hybrid_ranking

class SearchRequest(BaseModel):
    query: str

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize app state placeholder
    app.state.search_engine = None
    print("FastAPI app started. SearchEngine will load on first request.")
    yield
    print("Shutting down...")

app = FastAPI(
    title="Tamil Nadu Tourism Dynamic Semantic Search Engine",
    lifespan=lifespan
)

# CORS for React frontend (Allow all for deployment)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def perform_search(request: Request, query: str):
    if request.app.state.search_engine is None:
        print("Lazy loading SearchEngine...")
        request.app.state.search_engine = SearchEngine()
        print("SearchEngine loaded.")
        
    search_engine_instance = request.app.state.search_engine
    
    # 1. Preprocess for keyword search (sanitization)
    clean_query = preprocess_text(query)
    
    # 2. Perform Searches (Semantic is primary)
    semantic_results = search_engine_instance.semantic_search(query) # Use original query for semantic
    keyword_results = search_engine_instance.keyword_search(clean_query)
    
    # 3. Hybrid Ranking (No hardcoded boosts)
    final_results = hybrid_ranking(
        semantic_results, 
        keyword_results, 
        search_engine_instance.df,
        query
    )
    
    return final_results

@app.post("/api/search")
async def search_post(request: Request, search_req: SearchRequest):
    """
    Dynamic POST search endpoint.
    """
    results = await perform_search(request, search_req.query)
    return results

@app.get("/api/search")
async def search_get(request: Request, q: str = Query(..., min_length=1)):
    """
    Legacy GET endpoint for compatibility.
    """
    results = await perform_search(request, q)
    return {
        "query": q,
        "results": results,
        "count": len(results)
    }

@app.get("/api/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
