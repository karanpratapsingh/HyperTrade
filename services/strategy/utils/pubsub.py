import json

import nats
from utils.log import Logger


class PubSub:
    instance = None
    log = Logger.get()

    @staticmethod
    async def init(url):
        return await nats.connect(url)

    def __init__(self, instance):
        self.instance = instance

    async def subscribe(self, event, handler):
        sub = await self.instance.subscribe(event)
        self.log.info(f"Subscribe event={event}")
        async for msg in sub.messages:
            data = json.loads(msg.data.decode())
            await handler(data)

    async def publish(self, event, payload):
        self.log.info(f"Publish event={event}")
        data = str.encode(json.dumps(payload), "utf-8")
        return await self.instance.publish(event, data)
