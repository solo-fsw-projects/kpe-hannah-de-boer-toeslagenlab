export HOST_GID = $(shell id -g)
export HOST_UID = $(shell id -u)

up:
	docker compose up node -d

console: up
	docker compose exec node /bin/bash

down:
	docker compose down
