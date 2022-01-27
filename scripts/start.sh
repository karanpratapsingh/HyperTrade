#!/bin/bash

minikube start
minikube addons enable ingress

echo "Please add this to your /etc/hosts"
echo "$(minikube ip) platform.com"
