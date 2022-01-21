up:
	docker compose up -d

dev-exchange:
	make up
	docker exec -it exchange bash

dev-notification:
	make up
	docker exec -it notification bash

stop:
	docker compose stop

remove:
	docker compose rm --force

connect-argo:
	kubectl port-forward svc/argocd-server -n argocd 8080:443
