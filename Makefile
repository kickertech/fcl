IMAGE = fcl
TAG   = canary

.PHONY: clean
clean:
	rm -rf dist/

.PHONY: build
build:
	npm run build

.PHONY: build-docker
build-docker:
	docker build -t ${IMAGE}:${TAG} .

.PHONY: deploy
deploy: build
	git rev-parse --short HEAD > dist/version
	firebase deploy
