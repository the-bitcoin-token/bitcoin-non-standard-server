// @flow
/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */
/* eslint no-template-curly-in-string: "off" */

import express from 'express'
import bodyParser from 'body-parser'
import Db from './db'

Db.getConnection()

const app = express()
app.use(bodyParser.json())

app.post(
  '/dataOutputs',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    const sql =
      'INSERT INTO DataOutputs(txId, publicKey, outputData, new) VALUES(${txId}, ${publicKey}, ${outputData}, true)'
    try {
      await Db.none(sql, req.body)
      res.status(201).json({})
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
)

app.get(
  '/dataOutputs/:publicKey/:new',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    const sql =
      'SELECT * FROM DataOutputs WHERE publicKey = ${publicKey} AND new = ${new}'
    try {
      const result = await Db.any(sql, {
        publicKey: req.params.publicKey,
        new: req.params.new
      })
      res.status(201).json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
