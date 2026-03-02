def decimal_to_plain_string(d):
    s = format(d, 'f')  # force plain decimal, no exponent
    if '.' in s:
        s = s.rstrip('0').rstrip('.')  # remove trailing zeros and dot
    return s

normalized = {k: decimal_to_plain_string(v) for k, v in balances.items()}

return TrialBalancePerCurrencyResponse(per_currency=normalized)
