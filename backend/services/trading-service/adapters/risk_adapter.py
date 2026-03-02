class RiskAdapter:
    """
    Communicates with risk-service to approve/reject trade intents.
    """

    def approve(self, intent):
        """
        Return True/False or raise exception.
        """
        raise NotImplementedError
