up:
	docker compose up -d

dev-web:
	make up
	docker exec -it web sh

dev-exchange:
	make up
	docker exec -it exchange bash

dev-notification:
	make up
	docker exec -it notification bash

dev-strategy:
	make up
	docker exec -it strategy bash

stop:
	docker compose stop

remove:
	docker compose rm --force

connect-argo:
	kubectl port-forward svc/argocd-server -n argocd 8080:443
