VERSION ?= v0.0.1

build:
    ./build-all-images.sh $(VERSION)

load:
    ./load-all-images.sh $(VERSION)

deploy:
    ./deploy-platform.sh $(VERSION)

release: build load deploy
    @echo "✅ Release completed for version $(VERSION)"

