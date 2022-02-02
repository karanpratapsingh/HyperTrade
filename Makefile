start:
	minikube start

dev:
	skaffold dev --tail

stop:
	minikube stop

connect-argo:
	kubectl port-forward svc/argocd-server -n argocd 8080:443
