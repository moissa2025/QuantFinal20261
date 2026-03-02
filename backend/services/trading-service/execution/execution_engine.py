class ExecutionEngine:
    """
    Converts approved trade intents into Binance orders.
    """

    def __init__(self, binance_client, order_store, event_bus):
        self.binance = binance_client
        self.order_store = order_store
        self.event_bus = event_bus

    def execute_intent(self, intent):
        """
        Send order to Binance and persist internal order state.
        """
        raise NotImplementedError
