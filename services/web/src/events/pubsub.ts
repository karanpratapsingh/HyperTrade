import {
  Codec,
  connect,
  Msg,
  NatsConnection,
  NatsError,
  StringCodec,
  Subscription,
} from 'nats.ws';
import { API_HOST } from '../config/api';
import Env from '../utils/env';
import * as Notifications from '../utils/notifications';
import { Events } from './types';

const SERVER_URL = `ws://${API_HOST}/nats`;

const AUTH = {
  user: Env.NATS_USER,
  pass: Env.NATS_PASS,
};

export class PubSub {
  private static instance: PubSub;
  private codec: Codec<string>;
  private conn: NatsConnection;

  private constructor(conn: NatsConnection) {
    this.codec = StringCodec();
    this.conn = conn;
  }

  static getInstance = async (): Promise<PubSub> => {
    if (!this.instance) {
      try {
        const conn = await connect({
          servers: SERVER_URL,
          user: AUTH.user,
          pass: AUTH.pass,
        });

        this.instance = new PubSub(conn);
      } catch (err) {
        Notifications.error(err);
      }
    }

    return this.instance;
  };

  subscribe = <T>(
    event: Events,
    cb: (data: T) => void
  ): Subscription | undefined => {
    const callback = (err: NatsError | null, msg: Msg): void => {
      if (err) {
        throw err;
      }
      const data: T = JSON.parse(this.codec.decode(msg.data));
      cb(data);
    };

    const subscription = this.conn.subscribe(event, { callback });
    return subscription;
  };

  request = async <T = unknown, D = unknown>(event: Events, data?: D): Promise<T> => {
    const msg = await this.conn.request(
      event,
      this.codec.encode(JSON.stringify(data))
    );

    if (!msg) {
      throw new Error(`error: getting response for ${event}`);
    }

    const response: T = JSON.parse(this.codec.decode(msg.data));

    return response;
  };
}
