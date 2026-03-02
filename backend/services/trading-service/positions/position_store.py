class PositionStore:
    """
    Stores and retrieves customer positions.
    """

    def __init__(self):
        self.positions = {}

    def get(self, customer_id, symbol):
        return self.positions.get((customer_id, symbol))

    def save(self, position):
        self.positions[(position.customer_id, position.symbol)] = position
