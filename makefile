export HOST_GID = $(shell id -g)
export HOST_UID = $(shell id -u)

console:
	docker compose run --rm node /bin/bash

init:
	touch .bash_history
	docker compose run --rm node npm install

webserver:
	docker compose up -d webserver
