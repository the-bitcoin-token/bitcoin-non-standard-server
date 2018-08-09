// @flow
/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */
/* eslint no-template-curly-in-string: "off" */

import express from 'express'
import bodyParser from 'body-parser'
import Db from './db'
import { objToSnakeCase, objToCamelCase } from './utils'

Db.getConnection()

const app = express()
app.use(bodyParser.json())

app.post(
  '/dataOutputs',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    const sql =
      'INSERT INTO DataOutputs(tx_id, public_key, output_data, is_new) VALUES(${tx_id}, ${public_key}, ${output_data}, true)'
    try {
      await Db.none(sql, objToSnakeCase(req.body))
      res.status(201).json({})
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
)

app.get(
  '/dataOutputs/:publicKey/:isNew',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    const sql =
      'SELECT * FROM DataOutputs WHERE public_key = ${public_key} AND is_new = ${is_new}'
    try {
      const result: Array<any> = await Db.any(sql, objToSnakeCase(req.params))
      res.status(201).json(result.map(objToCamelCase))
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
