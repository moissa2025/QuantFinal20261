from services.journey_user import test_user_journey, user_login
from services.journey_wallet import test_wallet_journey
from services.journey_trading import test_trading_journey
from services.journey_kyc import test_kyc_journey
from services.journey_onboarding import test_onboarding_journey
from services.journey_ledger import test_ledger_journey
from services.journey_risk import test_risk_journey
from services.journey_reconciliation import test_reconciliation_journey

def run_all():
    print("=== USER JOURNEY ===")
    test_user_journey()
    access, _ = user_login()

    print("=== WALLET ===")
    test_wallet_journey(access)

    print("=== TRADING ===")
    test_trading_journey(access)

    print("=== KYC ===")
    test_kyc_journey(access)

    print("=== ONBOARDING ===")
    test_onboarding_journey(access)

    print("=== LEDGER ===")
    test_ledger_journey(access)

    print("=== RISK ===")
    test_risk_journey(access)

    print("=== RECONCILIATION ===")
    test_reconciliation_journey(access)

if __name__ == "__main__":
    run_all()

