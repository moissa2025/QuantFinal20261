class EventBus:
    """
    Publishes events to the system (Kafka, NATS, Redis Streams, etc.).
    """

    def publish(self, event):
        """
        Publish event to message bus.
        """
        raise NotImplementedError
