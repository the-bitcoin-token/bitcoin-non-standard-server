// @flow
/* eslint no-console: ["error", { allow: ["log"] }] */

// Load dot env config before anything else (hence require, not import)
require('dotenv').config()

const app = require('./app').default

declare var process: {
  env: {
    PORT: string
  }
}

const port = process.env.PORT
app.listen(port, () =>
  console.log(`Bitcoin non-standard server listening on port ${port}`)
)
