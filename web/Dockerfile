FROM ubuntu:20.04 as build

WORKDIR /src
COPY . /src

ENV BUNDLE_DISABLE_SHARED_GEMS=true
ENV BUNDLE_PATH__SYSTEM=false
ENV BUNDLE_PATH=/src/.bundle

# hadolint ignore=DL4006
RUN apt-get update --yes && \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes --no-install-recommends build-essential curl ruby ruby-dev pandoc zlib1g zlib1g-dev imagemagick && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install --yes --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/* && \
    make bootstrap clean build

FROM bitnami/apache:2.4.43
COPY --from=build /src/public /app
