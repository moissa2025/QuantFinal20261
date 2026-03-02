class FillListener:
    """
    Polls or listens to Binance for fills and forwards them
    to the fill handler.
    """

    def __init__(self, binance_client, order_store, fill_handler):
        self.binance = binance_client
        self.order_store = order_store
        self.fill_handler = fill_handler

    def run(self):
        """
        Main loop for detecting fills.
        TODO: Implement polling or WebSocket user data stream.
        """
        raise NotImplementedError
