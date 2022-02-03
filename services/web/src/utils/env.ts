class Env {
  static SYMBOL = import.meta.env.VITE_SYMBOL;
  static NATS_USER = import.meta.env.VITE_NATS_USER;
  static NATS_PASS = import.meta.env.VITE_NATS_PASS;
}
// TODO: check if env exists
export default Env;
