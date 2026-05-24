from fastapi import APIRouter, HTTPException

from app.models.schemas import AskRequest, AskResponse
from app.services.object_search import extract_object_from_question, find_object_location

router = APIRouter()


@router.post("/api/ask", response_model=AskResponse)
async def ask_question(request: AskRequest) -> AskResponse:
    object_query = extract_object_from_question(request.question)
    try:
        return await find_object_location(object_query)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
