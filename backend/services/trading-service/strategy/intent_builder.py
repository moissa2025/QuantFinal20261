class IntentBuilder:
    """
    Builds TradeIntent objects from strategy signals.
    """

    def build_intent(self, customer_id, symbol, side, quantity, reason):
        """
        Construct a TradeIntent.
        """
        raise NotImplementedError
