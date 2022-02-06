prepare:
	scripts/prepare.sh

dev:
	make prepare
	skaffold dev --profile=development --tail

stop:
	minikube stop

connect:
	doctl kubernetes cluster kubeconfig save trader-cluster
	kubectl port-forward svc/proxy 8080:8080
