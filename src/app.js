// @flow
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db", "__publicKeys", "__amount", "__kind"] }] */
/* eslint no-template-curly-in-string: "off" */

import cors from 'cors'
import type { $Request, $Response } from 'express'

import express from 'express'
import bodyParser from 'body-parser'
import Db from './db'
import { objToSnakeCase, objToCamelCase } from './utils'

Db.getConnection()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post('/', async (req: $Request, res: $Response) => {
  try {
    if (!req.body || typeof req.body !== 'object')
      throw new Error('Parameter must be an object')

    // store in UnP2sh
    const insertIntoUnP2sh =
      'INSERT INTO UnP2sh(tx_id, output_data) VALUES (${tx_id}, ${output_data})'
    await Db.none(insertIntoUnP2sh, objToSnakeCase(req.body))

    // store in Txos
    // $FlowFixMe
    const { outputData, txId } = req.body
    const outputDataObj = JSON.parse(outputData)

    const insertIntoTxos =
      'INSERT INTO Txos(public_key, tx_id, v_out, spent) VALUES (${publicKey}, ${txId}, ${vOut}, false)'
    await Promise.all(
      outputDataObj.map(
        async (element, index) =>
          element.__kind === 'script'
            ? Db.none(insertIntoTxos, {
                txId,
                vOut: index,
                publicKey: element.__publicKeys[0]
              })
            : Promise.resolve()
      )
    )

    res.status(201).json({})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/un-p2sh/:txId', async (req: $Request, res: $Response) => {
  try {
    const sql = 'SELECT output_data FROM UnP2sh WHERE tx_id = ${tx_id}'
    const result: Array<any> = await Db.any(sql, objToSnakeCase(req.params))
    if (result.length && result[0].output_data) {
      const data = JSON.parse(result[0].output_data)
      res.status(200).json(data.map(objToCamelCase))
    } else {
      throw new Error(`no data found for txId ${req.params.txId}`)
    }
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
})

app.post('/txos/set-spent/', async (req: $Request, res: $Response) => {
  if (!req.body || typeof req.body !== 'object')
    throw new Error('Parameter must be an object')

  try {
    const sql =
      'UPDATE Txos SET spent = true WHERE tx_id = ${tx_id} AND v_out = ${v_out}'
    await Db.none(sql, objToSnakeCase(req.body))
    res.status(201).json({})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/txos/:publicKey', async (req: $Request, res: $Response) => {
  try {
    const sql =
      'SELECT tx_id, v_out FROM Txos WHERE public_key = ${public_key} and spent = false'
    const result: Array<any> = await Db.any(sql, objToSnakeCase(req.params))
    res.status(200).json(result.map(objToCamelCase))
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
})

export default app
