dev:
	docker compose up -d
	docker exec -it trader bash

run:
	go run main.go

build:
	go build main.go
