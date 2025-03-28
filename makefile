export HOST_GID = $(shell id -g)
export HOST_UID = $(shell id -u)

console:
	docker compose run --rm node /bin/bash

init:
	touch .bash_history
	docker compose run --rm node npm install

test: test-unit test-functional

test-unit:
	docker compose run --rm test npm run test:unit

test-functional:
	docker compose run --rm test npm run test:functional

webserver:
	docker compose up -d webserver

test-debug:
	docker compose run --rm test-debug

down:
	docker compose down