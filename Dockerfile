FROM node:12-alpine AS build

ARG GITHUB_TOKEN
ARG CI
ENV NODE_OPTIONS="--max-old-space-size=4096"
WORKDIR /app
COPY . .
RUN echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc
RUN yarn install --non-interactive
RUN yarn build
RUN rm -r node_modules
RUN yarn install --production --non-interactive

WORKDIR /out
RUN cp -r /app/node_modules /app/build /app/server.js .


FROM node:12-alpine

ENV NODE_ENV=production
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

LABEL org.label-schema.build-date=$BUILD_DATE \
  org.label-schema.name="FOSDEM Schedule Widget" \
  org.label-schema.description="A FOSDEM schedule widget for the Element messenger" \
  org.label-schema.url="https://github.com/nordeck/fosdem-schedule-element-widget#readme" \
  org.label-schema.vcs-ref=$VCS_REF \
  org.label-schema.vcs-url="https://github.com/nordeck/fosdem-schedule-element-widget" \
  org.label-schema.vendor="Nordeck IT + Consulting GmbH" \
  org.label-schema.version=$VERSION \
  org.label-schema.schema-version="1.0" \
  org.label-schema.docker.cmd="docker run -e REACT_APP_PRIMARY_COLOR -e REACT_APP_HOME_SERVER_URL -p 3000:80 --name fosdem-schedule-element-widget nordeck/fosdem-schedule-element-widget:latest" \
  org.label-schema.docker.params="REACT_APP_PRIMARY_COLOR=Primary color of the theme,REACT_APP_HOME_SERVER_URL=The matrix homeserver url"

WORKDIR /app

COPY --from=build /out .
EXPOSE 80
CMD node server.js
