import os
import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from dependencies import get_services
import logging
from datetime import date

logger = logging.getLogger(__name__)

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_dummy")

from typing import Literal

class CheckoutSessionRequest(BaseModel):
    user_id: str = "anonymous"
    tier: Literal["one_time", "subscription", "one_time_ja", "subscription_ja"]
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
            return {"checkout_url": f"{req.success_url}{sep}session_id=dummy_session_test_{req.tier}"}
            
        if req.tier == "subscription":
            line_items = [{'price': 'price_1T4gGu2HCK38VhqueFDCkho8', 'quantity': 1}]
            mode = 'subscription'
        elif req.tier == "subscription_ja":
            line_items = [{'price': os.getenv("STRIPE_PRICE_SUB_JA", "price_dummy_sub_ja"), 'quantity': 1}]
            mode = 'subscription'
        elif req.tier == "one_time_ja":
            line_items = [{'price': os.getenv("STRIPE_PRICE_ONETIME_JA", "price_dummy_onetime_ja"), 'quantity': 1}]
            mode = 'payment'
        else:  # one_time
            line_items = [{'price': 'price_1T4gGQ2HCK38Vhqu92JyrSsA', 'quantity': 1}]
            mode = 'payment'

        sep = "&" if "?" in req.success_url else "?"
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode=mode,
            success_url=f"{req.success_url}{sep}session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=req.cancel_url,
            client_reference_id=req.user_id,
            # Attach tier so webhook can read it
            metadata={"tier": req.tier, "user_id": req.user_id},
        )
        return {"checkout_url": session.url}
    except Exception as e:
        logger.error(f"Error creating Stripe checkout session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """
    Stripe webhook to listen for successful payments and upsert Supabase profiles with correct tier.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_dummy")

    try:
        if endpoint_secret == "whsec_dummy":
            import json
            event = json.loads(payload.decode('utf-8'))
        else:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except Exception as e:
        logger.error(f"Webhook signature verification failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session.get('client_reference_id') or session.get('metadata', {}).get('user_id')
        tier = session.get('metadata', {}).get('tier', 'one_time_ja')

        if not user_id:
            logger.error("No user_id found in checkout session")
            return {"status": "ignored", "reason": "No user ID"}

        logger.info(f"Payment successful — user: {user_id}, tier: {tier}")

        try:
            _, _, supabase = get_services()

            profile_data = {
                "id": user_id,
                "tier": tier,
                "payment_date": date.today().isoformat(),
                "monthly_period_start": date.today().replace(day=1).isoformat(),
                "monthly_usage_count": 0,
            }

            # Upsert — create or overwrite profile for this user
            response = supabase.table("profiles").upsert(profile_data).execute()
            logger.info(f"Profile upserted: {response}")

        except Exception as e:
            logger.error(f"Error upserting profile: {e}")
            raise HTTPException(status_code=500, detail="Failed to update profile")

    return {"status": "success"}
