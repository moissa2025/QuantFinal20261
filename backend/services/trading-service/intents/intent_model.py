class TradeIntent:
    """
    Represents a strategy's request to trade.
    """

    def __init__(self, intent_id, customer_id, strategy_id, mandate_id,
                 symbol, side, action, quantity, order_type, limit_price,
                 metadata):
        self.intent_id = intent_id
        self.customer_id = customer_id
        self.strategy_id = strategy_id
        self.mandate_id = mandate_id
        self.symbol = symbol
        self.side = side
        self.action = action
        self.quantity = quantity
        self.order_type = order_type
        self.limit_price = limit_price
        self.metadata = metadata
