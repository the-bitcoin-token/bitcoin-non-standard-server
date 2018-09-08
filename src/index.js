// @flow
/* eslint no-console: ["error", { allow: ["log"] }] */

import app from './app'

declare var process: {
  env: {
    PORT: string
  }
}

const port = process.env.PORT

app.listen(port, () => console.log(`Un-P2SH listening on port ${port}`))
