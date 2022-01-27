start:
	minikube start
	minikube addons enable ingress
	echo "Please add this to your /etc/hosts"
	echo "$(minikube ip) platform.com"

dev:
	skaffold dev --tail

stop:
	minikube stop

connect-argo:
	kubectl port-forward svc/argocd-server -n argocd 8080:443
