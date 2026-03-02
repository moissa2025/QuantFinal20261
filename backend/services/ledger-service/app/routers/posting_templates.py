from fastapi import APIRouter
from pydantic import BaseModel
from decimal import Decimal

router = APIRouter(prefix="/posting-templates", tags=["posting_templates"])


class PostingTemplate(BaseModel):
    name: str
    description: str | None = None
    debit_account_type: str
    credit_account_type: str
    default_amount: Decimal | None = None


# In-memory for now; replace with DB table later
TEMPLATES: dict[str, PostingTemplate] = {}


@router.post("")
def create_template(template: PostingTemplate):
    TEMPLATES[template.name] = template
    return template


@router.get("/{name}")
def get_template(name: str):
    return TEMPLATES.get(name)

