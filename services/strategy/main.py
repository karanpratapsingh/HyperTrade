import asyncio
import nats
import os
import time
import json

class Env():
    NATS_URL = os.environ['NATS_URL']
    NATS_USER = os.environ['NATS_USER']
    NATS_PASS = os.environ['NATS_PASS']

class Events:
  Kline = "Event:Kline"


class PubSub:
  @staticmethod
  async def init(url):
    return await nats.connect(url)

  @staticmethod
  async def subscribe(nc, event, handler):
    sub = await nc.subscribe("Event:Kline")
    async for msg in sub.messages:
      data = json.loads(msg.data.decode())
      handler(data)

  @staticmethod
  async def publish(event, payload):
    return await nc.publish(event, payload)

async def main():
    url = "{user}:{password}@{url}".format(
        user=Env.NATS_USER,
        password=Env.NATS_PASS,
        url=Env.NATS_URL
    )

    nc = await PubSub.init(url)

    def klineHandler(data):
      print(data['Kline'])

    await PubSub.subscribe(nc, Events.Kline, klineHandler)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(main())
    finally:
        loop.close()
