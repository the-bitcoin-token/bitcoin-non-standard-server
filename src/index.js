// @flow
/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */

import express from 'express'
import bodyParser from 'body-parser'
import Db from './db'

Db.getConnection()

const app = express()
app.use(bodyParser.json())

app.post('/dataOutputs', (req, res) => {
  const json = Db._db.none(
    'INSERT INTO DataOutputs(txId, publicKey, outputData) VALUES(${txId}, ${publicKey}, ${outputData})',
    req.body
  )
  res.send(json)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
