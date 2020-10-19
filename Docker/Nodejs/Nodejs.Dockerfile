FROM node:lts-alpine AS nodejs

ENV YARN_VERSION 1.22.10

# Install yarn
RUN apk add --no-cache --virtual .build-deps-yarn curl \
    && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz \
    && apk del .build-deps-yarn

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

USER node
WORKDIR /home/node/app

COPY --chown=node:node ./dist/ ./
COPY --chown=node:node ./LICENSE ./
COPY --chown=node:node ./.env ./
COPY --chown=node:node ./yarn.lock ./
#COPY ./config/production-config.json ./
#COPY ./config/development-config.json ./
COPY --chown=node:node ./config/default.json ./config/
COPY --chown=node:node ./package.json ./
RUN yarn install --pure-lockfile

EXPOSE 3000

CMD ["node", "index.js"]
