# Python service module
from auth import verify_token

def process_transaction(user_id, amount):
    if not verify_token(user_id):
        raise ValueError("Invalid user token")
    return {"status": "ok", "user": user_id, "amount": amount}
