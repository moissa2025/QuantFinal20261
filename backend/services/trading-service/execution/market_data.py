class MarketDataStream:
    """
    Subscribes to Binance WebSocket streams for price data.
    """

    def __init__(self, symbol: str, on_tick=None):
        self.symbol = symbol
        self.on_tick = on_tick

    def start(self):
        """
        Start WebSocket stream.
        TODO: Implement WebSocket connection.
        """
        raise NotImplementedError
