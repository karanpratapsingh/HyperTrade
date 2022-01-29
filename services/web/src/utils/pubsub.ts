import {
  Codec,
  connect,
  Msg,
  NatsConnection,
  NatsError,
  StringCodec,
  Subscription,
} from 'nats.ws';

const SERVER_URL = 'ws://localhost:8080/nats';

const AUTH = {
  user: import.meta.env.VITE_NATS_USER,
  pass: import.meta.env.VITE_NATS_PASS,
};

export class PubSub {
  private codec: Codec<string>;
  private conn: NatsConnection | null = null;

  constructor() {
    this.codec = StringCodec();
  }

  init = async (): Promise<void> => {
    try {
      this.conn = await connect({
        servers: SERVER_URL,
        user: AUTH.user,
        pass: AUTH.pass,
      });
    } catch (err) {
      console.error(err);
    }
  };

  subscribe = <T>(
    event: string,
    cb: (data: T) => void
  ): Subscription | undefined => {
    const callback = (err: NatsError | null, msg: Msg): void => {
      if (err) {
        throw err;
      }
      const data: T = JSON.parse(this.codec.decode(msg.data));
      cb(data);
    };

    const subscription = this.conn?.subscribe(event, { callback });
    return subscription;
  };
}
