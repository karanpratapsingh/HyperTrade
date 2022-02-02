start:
	minikube start

install:
	cd services/exchange && go mod tidy && cd ..
	cd services/notification && go mod tidy && cd ..
	cd services/web && npm install && cd ..

dev:
	skaffold dev --tail

stop:
	minikube stop

connect-argo:
	kubectl port-forward svc/argocd-server -n argocd 8080:443
