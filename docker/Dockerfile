FROM node:alpine

RUN apk add --no-cache --virtual .build-deps git openssh-client \
  && git clone https://github.com/the-bitcoin-token/bitcoin-non-standard-server.git \
  && cd bitcoin-non-standard-server/ \
  && npm install \
  && npm run build  \
  && apk del .build-deps

COPY .env.docker /bitcoin-non-standard-server/.env
COPY entrypoint.sh /usr/local/bin/
COPY start.sh /usr/local/bin/

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["/usr/local/bin/start.sh"]
