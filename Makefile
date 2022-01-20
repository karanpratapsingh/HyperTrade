dev:
	docker compose up -d
	docker exec -it trader bash

stop:
	docker compose stop

remove:
	docker compose rm --force

run:
	go run main.go

build:
	go build main.go

connect-argo:
	kubectl port-forward svc/argocd-server -n argocd 8080:443
