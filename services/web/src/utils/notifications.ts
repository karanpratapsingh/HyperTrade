import { createToast } from 'vercel-toast';

const timeout = 2000;

function info(message: string): void {
  createToast(message, {
    timeout,
    type: 'success',
  });
}

function warning(message: string): void {
  createToast(message, {
    timeout,
    type: 'warning',
  });
}

function error(message: string): void {
  createToast(message, {
    timeout,
    type: 'error',
  });
}

const Notifications = {
  info,
  warning,
  error,
};

export default Notifications;
