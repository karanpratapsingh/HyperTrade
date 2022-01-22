import os


class Env:
    NATS_URL = os.environ['NATS_URL']
    NATS_USER = os.environ['NATS_USER']
    NATS_PASS = os.environ['NATS_PASS']
