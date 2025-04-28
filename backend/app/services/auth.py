from fastapi import Depends, HTTPException
from fastapi.security import OAuth2AuthorizationCodeBearer
from supabase import create_client, Client
import os

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="auth/authorize",
    tokenUrl="auth/token",
    auto_error=False
)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    if not supabase_url or not supabase_key:
        raise HTTPException(status_code=500, detail="Supabase configuration missing")
    supabase: Client = create_client(supabase_url, supabase_key)
    try:
        response = supabase.auth.get_user(token)
        if not response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": response.user.id, "email": response.user.email}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token validation failed: {str(e)}")