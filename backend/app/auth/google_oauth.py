from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.config import settings


class GoogleAuthError(Exception):
    pass


def verify_google_token(credential: str) -> dict:
    """Verifies a Google Sign-In ID token and returns the user's profile info."""
    if not settings.google_client_id:
        raise GoogleAuthError(
            "GOOGLE_CLIENT_ID missing on the server. Set it up at "
            "https://console.cloud.google.com/apis/credentials and add it "
            "to backend/.env"
        )
    try:
        info = id_token.verify_oauth2_token(
            credential, google_requests.Request(), settings.google_client_id
        )
    except ValueError as e:
        raise GoogleAuthError(f"Invalid Google credential: {e}")
    except Exception as e:
        raise GoogleAuthError(f"Couldn't verify Google sign-in right now: {e}")

    return {
        "google_id": info["sub"],
        "email": info["email"],
        "name": info.get("name", info["email"].split("@")[0]),
        "picture": info.get("picture"),
    }
