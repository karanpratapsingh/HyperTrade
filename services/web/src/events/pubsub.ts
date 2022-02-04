import {
  Codec,
  connect,
  Msg,
  NatsConnection,
  NatsError,
  StringCodec,
  Subscription
} from 'nats.ws';
import { API_HOST } from '../config/api';
import Env from '../utils/env';
import * as Notifications from '../utils/notifications';

const SERVER_URL = `ws://${API_HOST}/nats`;

const AUTH = {
  user: Env.NATS_USER,
  pass: Env.NATS_PASS,
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
      Notifications.error((err as any)?.message);
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
