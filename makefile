export HOST_GID = $(shell id -g)
export HOST_UID = $(shell id -u)

console:
	docker compose run --rm node /bin/bash
