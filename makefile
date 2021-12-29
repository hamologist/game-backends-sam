.PHONY: build
build:
	pushd players; \
	npm install; \
	npx gulp; \
	popd; \
	sam build;
