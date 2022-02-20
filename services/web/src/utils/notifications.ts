import { notification } from 'antd';
import { ArgsProps } from 'antd/lib/notification';
import { PubSub } from '../events/pubsub';
import {
  CriticalErrorEventPayload,
  Events,
  OrderEventPayload,
  TradeEventPayload,
} from '../events/types';

const defaultOptions: Partial<ArgsProps> = {
  duration: 5,
  placement: 'bottomRight',
};

export function mountNotifications(pubsub: PubSub): void {
  pubsub.subscribe<CriticalErrorEventPayload>(Events.CriticalError, payload => {
    error('Critical Error', new Error(payload.error));
  });

  pubsub.subscribe<OrderEventPayload>(
    Events.Order,
    ({ symbol, type, side }): void => {
      success(
        'Order Created',
        `${side} order of type ${type} was created for ${symbol}`
      );
    }
  );

  pubsub.subscribe<TradeEventPayload>(
    Events.Trade,
    ({ symbol, entry, exit }): void => {
      info(
        'Trade Executed',
        `Trade executed for ${symbol} with ${entry} entry and ${exit} exit`
      );
    }
  );
}

export function success(message: string, description?: string): void {
  notification.success({
    ...defaultOptions,
    message,
    description,
  });
}

export function info(message: string, description?: string): void {
  notification.info({
    ...defaultOptions,
    message,
    description,
  });
}

export function warning(message: string, description?: string): void {
  notification.warning({
    ...defaultOptions,
    message,
    description,
  });
}

export function error(message: string, error: any): void {
  notification.error({
    ...defaultOptions,
    message,
    description: error?.message,
  });
}
