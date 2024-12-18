SHELL := /bin/bash
DEV_DEPENDENCIES := web-ext prettier


build:
	web-ext build -s ./src -n build.zip --overwrite-dest
	cd src && tar -czf ../web-ext-artifacts/build.tar.gz ./*

lint:
	web-ext lint -s src/

publish:
	web-ext sign \
		--source-dir src \
		--api-key $(ADDONS_MOZ_JWT_ISSUER) --api-secret $(ADDONS_MOZ_JWT_SECRET) \
		--channel listed \
		--approval-timeout 0 \
		--amo-metadata ./amo-metadata.json

dev:
	python3 -m venv venv/ && \
	. venv/bin/activate && \
	pip install nodeenv && \
	nodeenv nenv && \
	. nenv/bin/activate && \
	npm install --global $(DEV_DEPENDENCIES)	
	@echo "Node virtual environment is set up. To continue working, activate the virtual environment with:"
	@echo "  source nenv/bin/activate"

valid:
	npx prettier src/ --write --ignore-path .prettierignore


.PHONY: build lint publish dev valid