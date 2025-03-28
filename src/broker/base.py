from abc import ABC, abstractmethod


class BrokerBase(ABC):

    def __init__(self):
        self.broker_client = None

    @abstractmethod
    def setup_broker_client(self):
        pass
