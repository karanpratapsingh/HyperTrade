import json

import nats


class PubSub:
    instance = None

    @staticmethod
    async def init(url):
        return await nats.connect(url)

    def __init__(self, instance):
        self.instance = instance

    async def subscribe(self, event, handler):
        sub = await self.instance.subscribe(event)
        async for msg in sub.messages:
            data = json.loads(msg.data.decode())
            await handler(data)

    async def publish(self, event, payload):
        return await self.instance.publish(event, str.encode(json.dumps(payload), "utf-8"))
