.PHONY: build
build:
	pushd backends; \
	npm install; \
	npx gulp; \
	popd; \
	sam build;
