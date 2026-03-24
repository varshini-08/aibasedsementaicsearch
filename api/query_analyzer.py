import re

def preprocess_text(text):
    """
    Lowercase, remove punctuation, and clean text.
    """
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', '', text)
    return text

def detect_category_intent(query):
    """
    Detect category from query for boosting.
    """
    query = query.lower()
    
    intents = {
        "Hill Station": ["hill", "mountain", "cool", "station", "misty", "height", "climb", "trekking", "coffee", "tea"],
        "Temple": ["temple", "god", "spiritual", "shrine", "worship", "divine", "pilgrimage", "gopuram", "darshan"],
        "Beach": ["beach", "sea", "ocean", "shore", "sand", "coast", "surfing", "marina", "coastline"],
        "Waterfall": ["waterfall", "falls", "cascade", "river", "flow", "bath"],
        "Wildlife": ["wildlife", "safari", "forest", "animals", "zoo", "nature", "birds", "tiger", "elephant", "sanctuary", "national park"],
        "Historic": ["historic", "fort", "palace", "ancient", "ruins", "museum", "architecture", "monument", "heritage", "unesco", "archaeology"]
    }
    
    for category, keywords in intents.items():
        if any(keyword in query for keyword in keywords):
            return category
            
    return None

def detect_district_intent(query):
    """
    Detect district from query for boosting.
    """
    query = query.lower()
    districts = [
        "madurai", "mahabalipuram", "thanjavur", "nilgiris", "dindigul", "chennai", 
        "ramanathapuram", "salem", "kanyakumari", "dharmapuri", "tenkasi", 
        "coimbatore", "villupuram", "cuddalore", "thiruvallur", "vellore", 
        "namakkal", "tirupattur", "nagapattinam", "mayiladuthurai", 
        "tiruchirappalli", "tiruvannamalai", "sivaganga", "chengalpattu", 
        "thoothukudi", "theni", "tirunelveli", "thiruvarur", "puducherry"
    ]
    
    for district in districts:
        if district in query:
            return district.capitalize()
    return None
