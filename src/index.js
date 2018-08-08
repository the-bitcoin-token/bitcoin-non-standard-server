// @flow

/*eslint no-console: ["error", { allow: ["log"] }] */

import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())

app.post('/dataOutputs', (req, res) => res.send(req.body))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
