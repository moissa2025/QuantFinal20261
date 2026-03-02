import io
import sys
from decimal import Decimal
from app import models
from scripts.daily_reconciliation import main


def test_daily_reconciliation_balanced(db_session, create_account):
    # Create a balanced ledger
    acc = create_account("Wallet", "GBP")

    txn = models.Transaction(type="simple", correlation_id="recon_test")
    db_session.add(txn)
    db_session.flush()

    db_session.add(models.JournalEntry(
        transaction_id=txn.id,
        account_id=acc.id,
        amount=Decimal("50"),
        reference="recon_test",
    ))
    db_session.add(models.JournalEntry(
        transaction_id=txn.id,
        account_id=acc.id,
        amount=Decimal("-50"),
        reference="recon_test",
    ))

    db_session.commit()

    # Capture stdout
    captured = io.StringIO()
    sys_stdout = sys.stdout
    sys.stdout = captured

    try:
        main()
    finally:
        sys.stdout = sys_stdout

    output = captured.getvalue()

    # Assertions based on your script's print format
    assert "balanced=True" in output
    assert "total=0" in output
    assert "WARNING" not in output


def test_daily_reconciliation_unbalanced(db_session, create_account):
    # Create an unbalanced ledger
    acc = create_account("Wallet", "GBP")

    txn = models.Transaction(type="simple", correlation_id="recon_unbalanced")
    db_session.add(txn)
    db_session.flush()

    db_session.add(models.JournalEntry(
        transaction_id=txn.id,
        account_id=acc.id,
        amount=Decimal("10"),
        reference="recon_unbalanced",
    ))
    # No offsetting entry → unbalanced

    db_session.commit()

    # Capture stdout
    captured = io.StringIO()
    sys_stdout = sys.stdout
    sys.stdout = captured

    try:
        main()
    finally:
        sys.stdout = sys_stdout

    output = captured.getvalue()

    assert "balanced=False" in output
    assert "total=10" in output
    assert "WARNING: Ledger not balanced!" in output

