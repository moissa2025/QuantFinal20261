use chrono::{DateTime, Utc};
use uuid::Uuid;

/// Core ledger side: debit or credit.
#[derive(Debug, Clone, Copy)]
pub enum Side {
    Debit,
    Credit,
}

/// Which book this posting belongs to: production vs risk shadow.
#[derive(Debug, Clone, Copy)]
pub enum Book {
    Production,
    RiskShadow,
}

/// High‑level transaction type.
#[derive(Debug, Clone, Copy)]
pub enum TransactionType {
    Deposit,
    Withdrawal,
    Trade,
    InternalTransfer,
    Staking,
    StakingYield,
    CardPayment,
    FxConversion,
}

/// A single posting line in the ledger.
#[derive(Debug, Clone)]
pub struct Posting {
    pub id: Uuid,
    pub txn_id: Uuid,
    pub book: Book,
    pub side: Side,
    pub account_id: String,
    pub currency: String,
    /// Minor units (e.g. cents)
    pub amount: i64,
    pub txn_type: TransactionType,
    pub created_at: DateTime<Utc>,
    /// Optional: risk dimension (e.g. "CREDIT_EXPOSURE", "MTM")
    pub risk_tag: Option<String>,
}

/// Helper to create a posting.
fn posting(
    txn_id: Uuid,
    book: Book,
    side: Side,
    account_id: impl Into<String>,
    currency: impl Into<String>,
    amount: i64,
    txn_type: TransactionType,
    risk_tag: Option<String>,
) -> Posting {
    Posting {
        id: Uuid::new_v4(),
        txn_id,
        book,
        side,
        account_id: account_id.into(),
        currency: currency.into(),
        amount,
        txn_type,
        created_at: Utc::now(),
        risk_tag,
    }
}

/// 1. Deposits
///
/// Customer deposits cash into platform.
/// Production:
///   DR: Bank / Custody
///   CR: Customer Cash
/// Risk shadow:
///   Mirror exposure on risk accounts.
pub fn build_deposit_postings(
    txn_id: Uuid,
    customer_cash_acct: &str,
    bank_custody_acct: &str,
    risk_customer_exposure_acct: &str,
    risk_bank_exposure_acct: &str,
    currency: &str,
    amount: i64,
) -> Vec<Posting> {
    let mut v = Vec::new();

    // Production book
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Debit,
        bank_custody_acct,
        currency,
        amount,
        TransactionType::Deposit,
        None,
    ));
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Credit,
        customer_cash_acct,
        currency,
        amount,
        TransactionType::Deposit,
        None,
    ));

    // Risk shadow: track customer credit vs bank asset
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Debit,
        risk_bank_exposure_acct,
        currency,
        amount,
        TransactionType::Deposit,
        Some("BANK_ASSET".into()),
    ));
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Credit,
        risk_customer_exposure_acct,
        currency,
        amount,
        TransactionType::Deposit,
        Some("CUSTOMER_LIABILITY".into()),
    ));

    v
}

/// 2. Withdrawals
///
/// Customer withdraws cash from platform.
/// Production:
///   DR: Customer Cash
///   CR: Bank / Custody
pub fn build_withdrawal_postings(
    txn_id: Uuid,
    customer_cash_acct: &str,
    bank_custody_acct: &str,
    risk_customer_exposure_acct: &str,
    risk_bank_exposure_acct: &str,
    currency: &str,
    amount: i64,
) -> Vec<Posting> {
    let mut v = Vec::new();

    // Production
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Debit,
        customer_cash_acct,
        currency,
        amount,
        TransactionType::Withdrawal,
        None,
    ));
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Credit,
        bank_custody_acct,
        currency,
        amount,
        TransactionType::Withdrawal,
        None,
    ));

    // Risk shadow
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Debit,
        risk_customer_exposure_acct,
        currency,
        amount,
        TransactionType::Withdrawal,
        Some("CUSTOMER_LIABILITY".into()),
    ));
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Credit,
        risk_bank_exposure_acct,
        currency,
        amount,
        TransactionType::Withdrawal,
        Some("BANK_ASSET".into()),
    ));

    v
}

/// 3. Trades (simple spot trade: base vs quote)
///
/// Example: customer buys BTC with USD.
/// Production:
///   DR: Customer Asset (BTC)
///   CR: Customer Cash (USD)
/// Risk shadow:
///   Track MTM / exposure per leg.
pub fn build_trade_postings(
    txn_id: Uuid,
    customer_base_acct: &str,
    customer_quote_acct: &str,
    risk_base_exposure_acct: &str,
    risk_quote_exposure_acct: &str,
    base_ccy: &str,
    quote_ccy: &str,
    base_amount: i64,
    quote_amount: i64,
) -> Vec<Posting> {
    let mut v = Vec::new();

    // Production: buy base, sell quote
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Debit,
        customer_base_acct,
        base_ccy,
        base_amount,
        TransactionType::Trade,
        None,
    ));
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Credit,
        customer_quote_acct,
        quote_ccy,
        quote_amount,
        TransactionType::Trade,
        None,
    ));

    // Risk shadow: base exposure vs quote exposure
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Debit,
        risk_base_exposure_acct,
        base_ccy,
        base_amount,
        TransactionType::Trade,
        Some("BASE_EXPOSURE".into()),
    ));
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Credit,
        risk_quote_exposure_acct,
        quote_ccy,
        quote_amount,
        TransactionType::Trade,
        Some("QUOTE_EXPOSURE".into()),
    ));

    v
}

/// 4. Internal transfers
///
/// Move balance between two internal accounts (same customer or internal books).
pub fn build_internal_transfer_postings(
    txn_id: Uuid,
    from_acct: &str,
    to_acct: &str,
    risk_from_acct: &str,
    risk_to_acct: &str,
    currency: &str,
    amount: i64,
) -> Vec<Posting> {
    let mut v = Vec::new();

    // Production
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Debit,
        to_acct,
        currency,
        amount,
        TransactionType::InternalTransfer,
        None,
    ));
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Credit,
        from_acct,
        currency,
        amount,
        TransactionType::InternalTransfer,
        None,
    ));

    // Risk shadow: mirror movement for exposure tracking
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Debit,
        risk_to_acct,
        currency,
        amount,
        TransactionType::InternalTransfer,
        Some("INTERNAL_MOVE".into()),
    ));
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Credit,
        risk_from_acct,
        currency,
        amount,
        TransactionType::InternalTransfer,
        Some("INTERNAL_MOVE".into()),
    ));

    v
}

/// 5. Staking principal lock
///
/// Customer stakes funds; principal moves to staking locked account.
/// Production:
///   DR: Staking Locked
///   CR: Customer Cash
pub fn build_staking_lock_postings(
    txn_id: Uuid,
    customer_cash_acct: &str,
    staking_locked_acct: &str,
    risk_staking_exposure_acct: &str,
    risk_customer_exposure_acct: &str,
    currency: &str,
    amount: i64,
) -> Vec<Posting> {
    let mut v = Vec::new();

    // Production
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Debit,
        staking_locked_acct,
        currency,
        amount,
        TransactionType::Staking,
        None,
    ));
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Credit,
        customer_cash_acct,
        currency,
        amount,
        TransactionType::Staking,
        None,
    ));

    // Risk shadow: platform liability vs staking exposure
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Debit,
        risk_staking_exposure_acct,
        currency,
        amount,
        TransactionType::Staking,
        Some("STAKING_EXPOSURE".into()),
    ));
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Credit,
        risk_customer_exposure_acct,
        currency,
        amount,
        TransactionType::Staking,
        Some("CUSTOMER_LIABILITY".into()),
    ));

    v
}

/// 5b. Staking yield distribution
///
/// Yield paid out to customer.
/// Production:
///   DR: Yield Expense / Pool
///   CR: Customer Cash
pub fn build_staking_yield_postings(
    txn_id: Uuid,
    yield_pool_acct: &str,
    customer_cash_acct: &str,
    risk_yield_exposure_acct: &str,
    risk_customer_exposure_acct: &str,
    currency: &str,
    amount: i64,
) -> Vec<Posting> {
    let mut v = Vec::new();

    // Production
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Debit,
        yield_pool_acct,
        currency,
        amount,
        TransactionType::StakingYield,
        None,
    ));
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Credit,
        customer_cash_acct,
        currency,
        amount,
        TransactionType::StakingYield,
        None,
    ));

    // Risk shadow: track yield cost vs customer benefit
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Debit,
        risk_yield_exposure_acct,
        currency,
        amount,
        TransactionType::StakingYield,
        Some("YIELD_COST".into()),
    ));
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Credit,
        risk_customer_exposure_acct,
        currency,
        amount,
        TransactionType::StakingYield,
        Some("CUSTOMER_PNL".into()),
    ));

    v
}

/// 6. Card payments
///
/// Customer spends via card; creates card clearing + customer liability.
/// Production:
///   DR: Card Clearing
///   CR: Customer Card Liability
pub fn build_card_payment_postings(
    txn_id: Uuid,
    card_clearing_acct: &str,
    customer_card_liab_acct: &str,
    risk_card_exposure_acct: &str,
    risk_customer_exposure_acct: &str,
    currency: &str,
    amount: i64,
) -> Vec<Posting> {
    let mut v = Vec::new();

    // Production
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Debit,
        card_clearing_acct,
        currency,
        amount,
        TransactionType::CardPayment,
        None,
    ));
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Credit,
        customer_card_liab_acct,
        currency,
        amount,
        TransactionType::CardPayment,
        None,
    ));

    // Risk shadow: card exposure vs customer credit risk
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Debit,
        risk_card_exposure_acct,
        currency,
        amount,
        TransactionType::CardPayment,
        Some("CARD_EXPOSURE".into()),
    ));
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Credit,
        risk_customer_exposure_acct,
        currency,
        amount,
        TransactionType::CardPayment,
        Some("CUSTOMER_CREDIT_RISK".into()),
    ));

    v
}

/// 7. FX conversions
///
/// Pure FX conversion (no market risk here, just operational).
/// Production:
///   DR: Customer FX To
///   CR: Customer FX From
pub fn build_fx_conversion_postings(
    txn_id: Uuid,
    from_acct: &str,
    to_acct: &str,
    risk_from_exposure_acct: &str,
    risk_to_exposure_acct: &str,
    from_ccy: &str,
    to_ccy: &str,
    from_amount: i64,
    to_amount: i64,
) -> Vec<Posting> {
    let mut v = Vec::new();

    // Production
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Debit,
        to_acct,
        to_ccy,
        to_amount,
        TransactionType::FxConversion,
        None,
    ));
    v.push(posting(
        txn_id,
        Book::Production,
        Side::Credit,
        from_acct,
        from_ccy,
        from_amount,
        TransactionType::FxConversion,
        None,
    ));

    // Risk shadow: track FX exposure shift
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Debit,
        risk_to_exposure_acct,
        to_ccy,
        to_amount,
        TransactionType::FxConversion,
        Some("FX_TO_EXPOSURE".into()),
    ));
    v.push(posting(
        txn_id,
        Book::RiskShadow,
        Side::Credit,
        risk_from_exposure_acct,
        from_ccy,
        from_amount,
        TransactionType::FxConversion,
        Some("FX_FROM_EXPOSURE".into()),
    ));

    v
}

