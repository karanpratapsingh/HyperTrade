prepare:
	scripts/prepare.sh

install:
	cd services/exchange && go mod tidy && cd ..
	cd services/notification && go mod tidy && cd ..
	cd services/web && npm install && cd ..

dev:
	skaffold dev --profile=development --tail

run:
	skaffold run --profile=production --tail

deploy:
	echo "TODO: deploy"

stop:
	minikube stop

connect-argo:
	kubectl port-forward svc/argocd-server -n argocd 8080:443
