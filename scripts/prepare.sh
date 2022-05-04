#!/bin/bash
set -e

ENVIRONMENT=$1

if [[ -z "$ENVIRONMENT" ]]; then
  echo "[x] Error: environment is required...exiting"
  exit 1
fi

function error() {
  TOOL=$1
  URL=$2

  echo "[x] Error: $TOOL is not installed."
  echo "Please install it from $URL"
  exit 1
}

echo "--- Preparing environment for $ENVIRONMENT ---"

echo "[?] Checking for required tools"

if [[ "$ENVIRONMENT" == "development" ]]; then
  if ! [ -x "$(command -v minikube)" ]; then
    error "minikube" "https://minikube.sigs.k8s.io/docs/start"
  fi
fi

if ! [ -x "$(command -v yq)" ]; then
  error "yq" "https://github.com/mikefarah/yq"
fi

if ! [ -x "$(command -v skaffold)" ]; then
  error "skaffold" "https://skaffold.dev/docs/install"
fi

if ! [ -x "$(command -v helm)" ]; then
  error "helm" "https://helm.sh/docs/intro/install"
fi

if [[ "$ENVIRONMENT" == "development" ]]; then
  if ! [ -x "$(command -v doctl)" ]; then
    error "doctl" "https://github.com/digitalocean/doctl"
  fi
fi

if [[ "$ENVIRONMENT" == "development" ]]; then
  if ! [ -x "$(command -v volta)" ]; then
    error "volta" "https://volta.sh"
  fi
fi

SECRETS_PATH=infrastructure/k8s/env.yaml
WEB_ENV_PATH=services/web/.env

NATS_USER=$(yq ".env.nats.USER" $SECRETS_PATH)
NATS_PASS=$(yq ".env.nats.PASS" $SECRETS_PATH)

if [ -f "$WEB_ENV_PATH" ]; then
  echo "[*] Updating .env for web"
  rm $WEB_ENV_PATH
else
  echo "[*] Creating .env for web"
fi

echo "
VITE_NATS_USER=$NATS_USER
VITE_NATS_PASS=$NATS_PASS
" >>$WEB_ENV_PATH

if [[ "$ENVIRONMENT" == "development" ]]; then
  echo "[*] Installing dependencies"
  cd services/exchange && go mod tidy && cd ../..
  cd services/notification && go mod tidy && cd ../..
  cd services/web && npm install && cd ../..

  echo "[*] Starting minikube"
  minikube start --driver=docker
 	kubectl config use-context minikube
fi

echo "--- Done ---"
