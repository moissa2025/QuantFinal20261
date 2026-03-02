class LedgerAdapter:
    """
    Sends posting instructions to the ledger-service.
    """

    def post(self, postings):
        """
        Send postings to ledger-service.
        """
        raise NotImplementedError
