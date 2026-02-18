
import vertexai
from vertexai.generative_models import GenerativeModel
import os
from dotenv import load_dotenv

# Load env to get GCP_PROJECT_ID
load_dotenv("backend/.env")
project_id = os.getenv("GCP_PROJECT_ID")

print(f"Checking models for project: {project_id} in us-central1")

try:
    project_id = "executive-comms-ninja2"
    vertexai.init(project=project_id, location="us-central1")
    
    # List some common models to check availability
    models_to_check = [
        "gemini-1.5-flash-001",
        "gemini-1.5-flash",
        "gemini-1.5-pro-001",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro-vision-001",
        "gemini-1.0-pro-vision",
        "gemini-pro-vision"
    ]
    
    available = []
    for model_id in models_to_check:
        try:
            model = GenerativeModel(model_id)
            # Try a simple prompt to verify access
            response = model.generate_content("Hello")
            print(f"✅ Available: {model_id}")
            available.append(model_id)
        except Exception as e:
            print(f"❌ Unavailable: {model_id} - Error: {str(e)[:100]}...")

    if not available:
        print("No models found! Check API enablement and location.")
    else:
        print(f"Use one of these: {available}")

except Exception as e:
    print(f"Init failed: {e}")
