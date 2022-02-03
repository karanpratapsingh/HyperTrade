#/bin/bash
set -e

echo "--- Preparing environment ---"
echo "[?] checking for required tools"

if ! [ -x "$(command -v yq)" ]; then
  echo "Error: yq is not installed."
  echo "Please install it from https://github.com/mikefarah/yq"
  exit 1
fi

if ! [ -x "$(command -v minikube)" ]; then
  echo "Error: minikube is not installed."
  echo "Please install it from https://minikube.sigs.k8s.io/docs/start/"
  exit 1
fi

if ! [ -x "$(command -v skaffold)" ]; then
  echo "Error: skaffold is not installed."
  echo "Please install it from https://skaffold.dev/docs/install/"
  exit 1
fi

if ! [ -x "$(command -v helm)" ]; then
  echo "Error: helm is not installed."
  echo "Please install it from https://helm.sh/docs/intro/install/"
  exit 1
fi

SECRETS_PATH=infrastructure/k8s/app/env.yaml
WEB_ENV_PATH=services/web/.env

NATS_USER=$(yq ".env.nats.USER" $SECRETS_PATH)
NATS_PASS=$(yq ".env.nats.PASS" $SECRETS_PATH)

if [ -f "$WEB_ENV_PATH" ]; then
  echo "[*] updating .env for web"
  rm $WEB_ENV_PATH
else
  echo "[*] creating .env for web"
fi

echo "
VITE_NATS_USER=$NATS_USER
VITE_NATS_PASS=$NATS_PASS
" >>$WEB_ENV_PATH

echo "[*] starting minikube"
minikube start
echo "--- Done ---"
