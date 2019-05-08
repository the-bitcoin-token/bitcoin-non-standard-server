// @flow
/* eslint no-console: ["error", { allow: ["log"] }] */

import 'dotenv/config'
import app from './app'

declare var process: { env: { PORT: string } }

const port = process.env.PORT
app.listen(port, () =>
  console.log(`Bitcoin non-standard server listening on port ${port}`)
)
