FROM ubuntu:20.04 as build

WORKDIR /src
COPY . /src

ENV BUNDLE_DISABLE_SHARED_GEMS=true
ENV BUNDLE_PATH__SYSTEM=false
ENV BUNDLE_PATH=/src/.bundle

RUN apt-get update --yes && \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes build-essential curl ruby ruby-dev pandoc zlib1g zlib1g-dev imagemagick librsvg2-bin && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install --yes nodejs && \
    make bootstrap clean build

FROM bitnami/apache:latest
COPY --from=build /src/web/public /app
