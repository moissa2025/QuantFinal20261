from pydantic import BaseModel, EmailStr

class OnboardingRequest(BaseModel):
    legalEntityName: str
    primaryContact: str
    workEmail: EmailStr
    jurisdiction: str | None = None
    aum: str | None = None
    primaryAssetFocus: str | None = None

