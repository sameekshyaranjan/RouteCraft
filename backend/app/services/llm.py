from langchain_groq import ChatGroq
from app.config import settings

_llm: ChatGroq | None = None


def get_llm(temperature: float = 0.3) -> ChatGroq:
    global _llm
    if not settings.groq_api_key:
        raise RuntimeError(
            "GROQ_API_KEY missing. Get a free key at https://console.groq.com/keys "
            "and add it to backend/.env"
        )
    # Note: not caching across different temperatures, but the client is
    # cheap to construct — simplicity over micro-optimization here.
    return ChatGroq(
        model=settings.groq_model,
        api_key=settings.groq_api_key,
        temperature=temperature,
    )
