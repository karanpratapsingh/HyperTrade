import asyncio

from internal.strategy import Strategy
from utils.env import Env
from utils.events import Events
from utils.pubsub import PubSub


async def main():
    url = "{user}:{password}@{url}".format(
        user=Env.NATS_USER,
        password=Env.NATS_PASS,
        url=Env.NATS_URL
    )

    instance = await PubSub.init(url)
    pubsub = PubSub(instance)

    strat = Strategy()

    async def handler(data):
        strat.populate(data)
        payload = strat.get_payload()
        await pubsub.publish(Events.DataFrame, payload)

    await pubsub.subscribe(Events.Kline, handler)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(main())
    finally:
        loop.close()
