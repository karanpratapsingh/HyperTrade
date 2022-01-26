start:
	minikube start

dev:
	skaffold dev --tail --port-forward

stop:
	minikube stop

connect-argo:
	kubectl port-forward svc/argocd-server -n argocd 8080:443
