// @flow
/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */

import express from 'express'
import bodyParser from 'body-parser'
import Db from './db'

Db.getConnection()

const app = express()
app.use(bodyParser.json())

app.post('/dataOutputs', async (req: $Subtype<express$Request>, res: express$Response) => {
  const sql = 'INSERT INTO DataOutputs(txId, publicKey, outputData) VALUES(${txId}, ${publicKey}, ${outputData})'
  try {
    await Db._db.none(sql, req.body)
    res.status(201).json({})
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
