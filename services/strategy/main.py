import asyncio

from internal.events import Events
from internal.pubsub import PubSub
from internal.strategy import StrategyMap
from internal.streams import Streams
from utils.env import Env


async def main():
    url = "{user}:{password}@{url}".format(
        user=Env.NATS_USER,
        password=Env.NATS_PASS,
        url=Env.NATS_URL
    )

    hashmap = StrategyMap()

    instance = await PubSub.init(url)
    pubsub = PubSub(instance)
    await pubsub.jetstream(Streams.DataFrame)

    async def handler(data):
        symbol = data['kline']['symbol']
        strategy = hashmap.get_instance(symbol)

        strategy.populate(data)
        payload = strategy.get_payload()
        await pubsub.publish(Events.DataFrame, payload)

    await pubsub.subscribe(Events.Kline, handler)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(main())
    finally:
        loop.close()
