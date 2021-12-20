.PHONY: build
build:
	pushd hello-world; \
	npm install; \
	npx gulp; \
	popd; \
	sam build;
