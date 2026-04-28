import importlib
import pkgutil
from typing import List, Tuple

def run_all_tests() -> List[Tuple[str, bool, object]]:
    results = []
    for _, module_name, _ in pkgutil.iter_modules(['tests/services']):
        module = importlib.import_module(f"tests.services.{module_name}")
        for name in dir(module):
            if name.startswith("test_"):
                fn = getattr(module, name)
                test_name, ok, data = fn()
                results.append((test_name, ok, data))
    return results

if __name__ == "__main__":
    results = run_all_tests()
    print("\n=== TEST RESULTS ===")
    for name, ok, data in results:
        status = "PASS" if ok else "FAIL"
        print(f"{name:40} {status}")
        if not ok:
            print(f"  → {data}")
