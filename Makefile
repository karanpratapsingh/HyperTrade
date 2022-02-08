dev:
	scripts/prepare.sh development
	skaffold dev --profile=development --tail

stop:
	minikube stop

prod:
	scripts/prepare.sh production

connect:
	doctl kubernetes cluster kubeconfig save trader-cluster
	kubectl port-forward svc/proxy 8080:8080

delete:
	kubectl delete --all deployments
