class BinanceClient:
    """
    Low-level REST/WebSocket client for Binance.
    Handles signing, order placement, and account queries.
    """

    def __init__(self, api_key: str, api_secret: str):
        self.api_key = api_key
        self.api_secret = api_secret

    def create_order(self, symbol, side, order_type, quantity, price=None):
        """
        Create an order on Binance.
        TODO: Implement REST call + signing.
        """
        raise NotImplementedError

    def get_order(self, symbol, order_id):
        """
        Fetch order status from Binance.
        """
        raise NotImplementedError
