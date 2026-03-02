class StrategyEngine:
    """
    Evaluates market data and emits trade intents.
    """

    def __init__(self, intent_builder):
        self.intent_builder = intent_builder

    def on_market_tick(self, tick):
        """
        Called on every price update.
        TODO: Implement strategy logic.
        """
        raise NotImplementedError
