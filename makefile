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

test-env:
	docker compose run --rm node npm run test-env

test-debug:
	docker compose run --rm test-debug

build:
	docker compose run --rm node npm run build

down:
	docker compose down

.PHONY: console init test test-unit test-functional test-env test-debug down