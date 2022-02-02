import { createToast } from 'vercel-toast';

const timeout = 2000;

function success(message: string): void {
  createToast(message, {
    timeout,
    type: 'success',
  });
}

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
  success,
  info,
  warning,
  error,
};

export default Notifications;
