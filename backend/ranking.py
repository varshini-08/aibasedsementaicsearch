def calculate_context_score(query, row):
    """
    Calculate a context score based on query intent, category, and keyword overlap.
    """
    query = query.lower()
    place_keywords = [k.strip().lower() for k in str(row['keywords']).split(',')]
    category = str(row['category'])
    
    context_score = 0.0
    
    # 1. Intent Analysis Boosts
    nature_intents = ["nature", "forest", "green", "wildlife", "tree", "bird"]
    relax_intents = ["peaceful", "relax", "calm", "stress", "quiet", "serene"]
    
    is_nature_query = any(word in query for word in nature_intents)
    is_relax_query = any(word in query for word in relax_intents)
    
    # Nature/Relax query -> boost nature categories
    nature_categories = ["Hill Station", "Waterfall", "Wildlife", "Beach"]
    if (is_nature_query or is_relax_query) and category in nature_categories:
        context_score += 0.2 # Strong intent boost
        
    # 2. Soft Category Weighting (as requested)
    if category in ["Hill Station", "Waterfall", "Wildlife"]:
        context_score += 0.1
    elif category in ["Temple", "Historic"]:
        context_score -= 0.05
        
    # 3. Keyword Overlap Scoring
    query_words = set(query.split())
    overlap = query_words.intersection(set(place_keywords))
    if overlap:
        context_score += 0.1 * len(overlap)
        
    # Clamp context score to reasonable range [0, 1] for normalization
    return max(0.0, min(1.0, context_score))

def hybrid_ranking(semantic_results, keyword_results, df, original_query):
    """
    Combine scores from semantic and keyword engines with context-aware boosting.
    Formula: 0.7 * Semantic + 0.2 * Keyword + 0.1 * Context
    """
    scores = {}
    
    # 0. Initialize scores with semantic results
    for res in semantic_results:
        idx = res['id']
        scores[idx] = {
            "semantic_score": res['semantic_score'],
            "keyword_score": 0
        }
        
    # 1. Integrate keyword scores
    for res in keyword_results:
        idx = res['id']
        if idx in scores:
            scores[idx]["keyword_score"] = res['keyword_score']
        else:
            scores[idx] = {
                "semantic_score": 0,
                "keyword_score": res['keyword_score']
            }
            
    # 2. Final Score Calculation
    final_results = []
    for idx, data in scores.items():
        row = df.iloc[idx]
        
        # Calculate context score dynamically based on original query
        context_score = calculate_context_score(original_query, row)
        
        # New formula: 0.7*S + 0.2*K + 0.1*C
        final_score = (
            0.7 * data["semantic_score"] +
            0.2 * data["keyword_score"] +
            0.1 * context_score
        )
        
        final_results.append({
            "name": row["place_name"],
            "district": row["district"],
            "category": row["category"],
            "description": row["description"],
            "keywords": row["keywords"],
            "final_score": float(final_score),
            "context_boost": float(context_score),
            "match_type": "Hybrid" if data["semantic_score"] > 0 and data["keyword_score"] > 0 else ("Semantic" if data["semantic_score"] > 0 else "Keyword")
        })
        
    # 3. Sort by final score descending
    final_results.sort(key=lambda x: x["final_score"], reverse=True)
    return final_results[:10]
