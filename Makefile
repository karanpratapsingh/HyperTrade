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
