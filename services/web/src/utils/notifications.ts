import { createToast } from 'vercel-toast';

const timeout = 2000;

export function info(message: string): void {
  createToast(message, {
    timeout,
    type: 'success',
  });
}

export function warning(message: string): void {
  createToast(message, {
    timeout,
    type: 'warning',
  });
}

export function error(message: string): void {
  createToast(message, {
    timeout,
    type: 'error',
  });
}
