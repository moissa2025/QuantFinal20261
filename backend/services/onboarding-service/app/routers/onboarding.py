from fastapi import APIRouter, status
from ..models.onboarding import OnboardingRequest

router = APIRouter(prefix="/v1/onboarding", tags=["onboarding"])

@router.post("/create-account", status_code=status.HTTP_202_ACCEPTED)
async def create_account(req: OnboardingRequest):
    # TODO: orchestrate user-service, kyc-service, aml-monitoring-service, ledger-service
    return {
        "status": "accepted",
        "message": "Onboarding request accepted for processing.",
        "entity": req.legalEntityName,
    }

