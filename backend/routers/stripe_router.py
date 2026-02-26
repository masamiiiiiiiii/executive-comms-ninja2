import os
import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from dependencies import get_services
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize Stripe with a dummy key if not set.
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_dummy")

from typing import Literal

class CheckoutSessionRequest(BaseModel):
    user_id: str = "anonymous"
    tier: Literal["one_time", "subscription"]
    success_url: str
    cancel_url: str

@router.post("/create-checkout-session")
async def create_checkout_session(req: CheckoutSessionRequest):
    """
    Creates a Stripe Checkout session for the selected tier.
    """
    try:
        if stripe.api_key == "sk_test_dummy":
            logger.info("Using dummy Stripe key. Bypassing real Stripe API call.")
            sep = "&" if "?" in req.success_url else "?"
            return {"checkout_url": f"{req.success_url}{sep}session_id=dummy_session_test_123"}
            
        if req.tier == "subscription":
            line_items = [{
                'price': 'price_1T4gGu2HCK38VhqueFDCkho8', # prod_U2loAa9CeE5gtz (Tactical Deep Dive / $149)
                'quantity': 1,
            }]
            mode = 'subscription'
        else:
            line_items = [{
                'price': 'price_1T4gGQ2HCK38Vhqu92JyrSsA', # prod_U2lo68paorrnM8 (Executive Pro / $49)
                'quantity': 1,
            }]
            mode = 'payment'

        sep = "&" if "?" in req.success_url else "?"
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode=mode,
            success_url=f"{req.success_url}{sep}session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=req.cancel_url,
            client_reference_id=req.user_id,
        )
        return {"checkout_url": session.url}
    except Exception as e:
        logger.error(f"Error creating Stripe checkout session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """
    Stripe webhook to listen for successful payments and update Supabase user tier.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_dummy")

    try:
        if endpoint_secret == "whsec_dummy":
            # For local testing without a real webhook secret, just parse the payload
            import json
            event = json.loads(payload.decode('utf-8'))
        else:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
    except Exception as e:
        logger.error(f"Webhook signature verification failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        user_id = session.get('client_reference_id')
        if not user_id:
            logger.error("No client_reference_id in checkout session")
            return {"status": "ignored", "reason": "No user ID attached to session"}
            
        print(f"DEBUG: Payment successful for User: {user_id}. Proceeding to update tier.")
        
        try:
            # Update user tier in Supabase
            _, _, supabase = get_services()
            
            # Assuming you have a 'users' or 'profiles' table with a 'tier' column.
            # Example Update (You can adjust table name/schema as needed):
            response = supabase.table("users").update({"tier": "pro"}).eq("id", user_id).execute()
            
            print(f"DEBUG: Supabase Update Response: {response}")
            
        except Exception as e:
            logger.error(f"Error updating user tier in DB: {e}")
            raise HTTPException(status_code=500, detail="Failed to update database")

    return {"status": "success"}
