import os 
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not all([SUPABASE_URL, SUPABASE_SECRET_KEY, GROQ_API_KEY]):
    raise ValueError("Missing Critical Environment Variables")

# Export the SYNCHRONOUS client globally so webhooks.py can use it normally
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)