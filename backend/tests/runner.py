import importlib
import traceback
import time

ENDPOINT_TEST = "backend.tests.test_all_endpoints"

SERVICES = [
    "backend.tests.services.journey_user",
    "backend.tests.services.journey_kyc",
    "backend.tests.services.journey_onboarding",
    "backend.tests.services.journey_wallet",
    "backend.tests.services.journey_trading",
    "backend.tests.services.journey_risk",
    "backend.tests.services.journey_ledger",
    "backend.tests.services.journey_reconciliation",
    "backend.tests.services.journey_intelligence",
]

def run_module(module_name):
    print(f"\n=== Running {module_name} ===")
    try:
        module = importlib.import_module(module_name)
        if hasattr(module, "run"):
            result = module.run()
        elif hasattr(module, "main"):
            result = module.main()
        else:
            print(f"⚠️  No run() or main() found in {module_name}")
            return False

        if result is True:
            print(f"✅ {module_name} PASSED")
            return True
        else:
            print(f"❌ {module_name} FAILED")
            return False

    except Exception as e:
        print(f"❌ {module_name} CRASHED")
        traceback.print_exc()
        return False


def main():
    print("\n🔍 GlobalQuantX Automated Backend Test Suite")
    print("============================================\n")

    start = time.time()
    results = {}

    # 1. Test all endpoints first
    print("\n=== Running endpoint health checks ===")
    results["endpoints"] = run_module(ENDPOINT_TEST)

    # 2. Run all journey tests
    for svc in SERVICES:
        results[svc] = run_module(svc)

    # Summary
    print("\n============================================")
    print("🧪 TEST SUMMARY")
    print("============================================")

    passed = sum(1 for r in results.values() if r)
    failed = sum(1 for r in results.values() if not r)

    for name, result in results.items():
        status = "PASS" if result else "FAIL"
        print(f"{name:40} {status}")

    print("\n--------------------------------------------")
    print(f"Total: {len(results)} | Passed: {passed} | Failed: {failed}")
    print(f"⏱️  Total time: {round(time.time() - start, 2)}s")
    print("--------------------------------------------")

    # Exit code for CI/CD
    if failed > 0:
        exit(1)
    else:
        exit(0)


if __name__ == "__main__":
    main()

