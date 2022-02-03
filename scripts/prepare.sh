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
  echo "[x] Error: minikube is not installed."
  echo "Please install it from https://minikube.sigs.k8s.io/docs/start/"
  exit 1
fi

if ! [ -x "$(command -v skaffold)" ]; then
  echo "[x] Error: skaffold is not installed."
  echo "Please install it from https://skaffold.dev/docs/install/"
  exit 1
fi

if ! [ -x "$(command -v helm)" ]; then
  echo "[x] Error: helm is not installed."
  echo "Please install it from https://helm.sh/docs/intro/install/"
  exit 1
fi

SECRETS_PATH=infrastructure/k8s/app/env.yaml
WEB_ENV_PATH=services/web/.env

SYMBOL=$(yq ".env.global.SYMBOL" $SECRETS_PATH)
NATS_USER=$(yq ".env.nats.USER" $SECRETS_PATH)
NATS_PASS=$(yq ".env.nats.PASS" $SECRETS_PATH)

if [ -f "$WEB_ENV_PATH" ]; then
  echo "[*] updating .env for web"
  rm $WEB_ENV_PATH
else
  echo "[*] creating .env for web"
fi

echo "
VITE_SYMBOL=$SYMBOL
VITE_NATS_USER=$NATS_USER
VITE_NATS_PASS=$NATS_PASS
" >>$WEB_ENV_PATH

echo "[*] installing dependencies"
cd services/exchange && go mod tidy && cd ../..
cd services/notification && go mod tidy && cd ../..
cd services/web && npm install && cd ../..

echo "[*] starting minikube"
minikube start
echo "--- Done ---"
