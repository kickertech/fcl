IMAGE = fcl
TAG   = canary

.PHONY: clean
clean:
	rm -rf dist/

.PHONY: build
build:
	docker build -t ${IMAGE}:${TAG} .

.PHONY: deploy
deploy: build
	id=$(shell docker create --name fcl ${IMAGE}:${TAG})
	docker cp fcl:/app/dist ./dist
	docker rm -f fcl
	git rev-parse --short HEAD > dist/version
	firebase deploy
