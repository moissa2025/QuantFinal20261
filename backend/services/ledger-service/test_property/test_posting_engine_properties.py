# test_property/test_posting_engine_properties.py
from decimal import Decimal
from hypothesis import given, strategies as st
from app.posting_engine import post_transaction

@given(
    amounts=st.lists(
        st.decimals(min_value="-1000", max_value="1000", places=2),
        min_size=2,
        max_size=10,
    )
)
def test_posting_engine_is_balanced(amounts, db_session, create_account):
    acc = create_account("Prop", "GBP")

    total = sum(amounts)
    # force balancing by adjusting last leg
    amounts[-1] = Decimal(amounts[-1]) - total

    # call your posting engine with generated legs
    post_transaction(db_session, acc.id, amounts)

    # assert ledger remains balanced
    # (e.g. sum of journal entries for txn == 0)
