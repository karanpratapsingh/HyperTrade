import { createToast } from 'vercel-toast';

const timeout = 4000;

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

export function error(error: any): void {
  createToast(error?.message, {
    timeout,
    type: 'error',
  });
}
