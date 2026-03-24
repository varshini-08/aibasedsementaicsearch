import urllib.request
import json

def test_search(query):
    url = "http://localhost:8000/search"
    payload = json.dumps({"query": query}).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    
    print(f"\nTesting Query: '{query}'")
    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                results = json.loads(response.read().decode("utf-8"))
                print(f"Top 10 Results:")
                for i, res in enumerate(results):
                    print(f"{i+1}. {res['name']} ({res['category']})")
                    print(f"   Score: {res['final_score']:.4f} | Context Boost: {res.get('context_boost', 0):.4f}")
            else:
                print(f"Error: {response.status}")
    except Exception as e:
        print(f"Request failed: {e}")

test_search("i feel stressed i need a peaceful place to relax in nature")
