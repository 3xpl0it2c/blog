FROM node:lts-alpine

ENV YARN_VERSION 1.22.0
ENV NODE_ENV production

USER node
WORKDIR /home/node/app

# Install yarn
RUN apk add --no-cache --virtual .build-deps-yarn curl \
    && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz \
    && apk del .build-deps-yarn

COPY ./dist ./
COPY ./LICENSE ./
COPY ./.env ./
COPY ./yarn.lock ./
COPY ./config/production-config.json ./
COPY ./config/development-config.json ./
COPY ./config/default.json ./

# Install dependecies.
RUN yarn install --pure-lockfile

EXPOSE 8080

# We only copy the dist folder, therefore there is no need for stating dist/index.js
CMD ["node", "index.js"]
