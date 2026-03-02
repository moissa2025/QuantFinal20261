class Position:
    """
    Represents a customer's position in a symbol.
    """

    def __init__(self, customer_id, symbol, side="FLAT",
                 quantity=0.0, avg_entry_price=0.0, realised_pnl=0.0):
        self.customer_id = customer_id
        self.symbol = symbol
        self.side = side
        self.quantity = quantity
        self.avg_entry_price = avg_entry_price
        self.realised_pnl = realised_pnl

    def to_dict(self):
        return self.__dict__
