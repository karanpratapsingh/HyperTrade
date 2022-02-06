prepare:
	scripts/prepare.sh

dev:
	make prepare
	skaffold dev --profile=development --tail

run:
	skaffold run --profile=production --tail

deploy:
	echo "TODO: deploy"

stop:
	minikube stop

connect-argo:
	kubectl port-forward svc/argocd-server -n argocd 8080:443
