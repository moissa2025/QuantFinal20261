class IntentRouter:
    """
    Sends intents to the risk engine and forwards approved ones
    to the execution engine.
    """

    def __init__(self, risk_adapter, execution_engine):
        self.risk_adapter = risk_adapter
        self.execution_engine = execution_engine

    def route(self, intent):
        """
        Validate with risk engine, then execute.
        """
        raise NotImplementedError
