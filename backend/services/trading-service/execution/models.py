class Order:
    """
    Internal representation of an order placed on Binance.
    """

    def __init__(self, internal_id, venue_order_id, customer_id, symbol, side,
                 status, orig_qty, executed_qty, price):
        self.internal_id = internal_id
        self.venue_order_id = venue_order_id
        self.customer_id = customer_id
        self.symbol = symbol
        self.side = side
        self.status = status
        self.orig_qty = orig_qty
        self.executed_qty = executed_qty
        self.price = price

    def to_dict(self):
        return self.__dict__
