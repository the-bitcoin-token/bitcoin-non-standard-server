#!/bin/sh
set -e

cd /bitcoin-non-standard-server/
npm run init

exec "$@"
