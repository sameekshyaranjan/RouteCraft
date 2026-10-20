import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db, User
from app.models.schemas import GoogleLoginRequest, AuthResponse, UserOut
from app.auth.google_oauth import verify_google_token, GoogleAuthError
from app.auth.jwt_handler import create_access_token
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/google", response_model=AuthResponse)
async def google_login(req: GoogleLoginRequest, db: AsyncSession = Depends(get_db)):
    try:
        profile = verify_google_token(req.credential)
    except GoogleAuthError as e:
        raise HTTPException(401, str(e))

    result = await db.execute(select(User).where(User.email == profile["email"]))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            id=str(uuid.uuid4()),
            email=profile["email"],
            name=profile["name"],
            picture=profile.get("picture"),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    elif user.name != profile["name"] or user.picture != profile.get("picture"):
        user.name = profile["name"]
        user.picture = profile.get("picture")
        await db.commit()

    token = create_access_token(user.id, user.email)
    return AuthResponse(
        access_token=token,
        user=UserOut(
            id=user.id, email=user.email, name=user.name, picture=user.picture
        ),
    )


@router.get("/me", response_model=UserOut)
async def get_me(user: User = Depends(get_current_user)):
    return UserOut(id=user.id, email=user.email, name=user.name, picture=user.picture)
