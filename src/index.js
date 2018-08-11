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
  '/unP2sh',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    const sql =
      'INSERT INTO UnP2sh(tx_id, output_data) VALUES(${tx_id}, ${output_data})'
    try {
      await Db.none(sql, objToSnakeCase(req.body))
      res.status(201).json({})
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
)

app.get(
  '/unP2sh/:txId',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    const sql = 'SELECT output_data FROM UnP2sh WHERE tx_id = ${tx_id}'
    try {
      const result: Array<any> = await Db.any(sql, objToSnakeCase(req.params))
      const data = JSON.parse(result[0].output_data)
      res.status(201).json(data.map(objToCamelCase))
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
