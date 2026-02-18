import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv("backend/.env")

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(url, key)

try:
    # Supabase-py admin auth client usage - returns a UserResponse object or list?
    # Based on error, it returned a list directly or an object without .users property
    response = supabase.auth.admin.list_users()
    
    # print(dir(response)) # Debugging
    
    # Assuming response itself is a list of User objects or similar
    # Check if response has 'users' attribute, if not iterate directly
    users = response.users if hasattr(response, 'users') else response

    print("Existing Users:")
    for user in users:
        print(f"ID: {user.id}, Email: {user.email}")

    guest_email = "guest@executive-comms.ninja"
    guest_user = next((u for u in users if u.email == guest_email), None)

    if not guest_user:
        print(f"\nCreating guest user: {guest_email}")
        user = supabase.auth.admin.create_user({
            "email": guest_email,
            "password": "guest-password-12345",
            "email_confirm": True
        })
        # The create_user response structure might also be different
        new_id = user.user.id if hasattr(user, 'user') else user.id
        print(f"Created Guest User ID: {new_id}")
    else:
        print(f"\nGuest User found: {guest_user.id}")

except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Error: {e}")
