// @flow
/* eslint no-console: ["error", { allow: ["log"] }] */

import 'dotenv/config'
import app from './app'

declare var process: { env: { PORT: string } }

const { PORT } = process.env
app.listen(PORT, () =>
  console.log(`Bitcoin non-standard server listening on port ${PORT}`)
)
