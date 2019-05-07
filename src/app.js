// @flow
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db", "__publicKeys", "__amount", "__kind"] }] */
/* eslint no-template-curly-in-string: "off" */

import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import type { $Request, $Response } from 'express'
import WebSocket from 'ws'

import Db from './db'
import { objToSnakeCase, objToCamelCase } from './utils'

Db.getConnection()

// Web socket
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', ws => {
  ws.on('message', msg => {
    ws.send(msg)
  })
})

// Http server
const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post('/', async ({ body }: $Request, res: $Response) => {
  try {
    if (!body || typeof body !== 'object')
      throw new Error('Parameter must be an object')

    // store in UnP2sh
    const unp2shSql =
      'INSERT INTO UnP2sh(tx_id, output_data) VALUES (${tx_id}, ${output_data})'
    await Db.none(unp2shSql, objToSnakeCase(body))

    // store in Txos
    const { outputData, txId } = body

    // $FlowFixMe
    const outputDataJson = JSON.parse(outputData)

    const sqlTxos =
      'INSERT INTO Txos(public_key, tx_id, v_out, spent) VALUES (${publicKey}, ${txId}, ${vOut}, false)'
    await Promise.all(
      outputDataJson.map(
        async ({ __kind, __publicKeys: [publicKey] = [] }, vOut) =>
          __kind === 'script'
            ? Db.none(sqlTxos, { txId, vOut, publicKey })
            : Promise.resolve()
      )
    )

    res.status(201).json({})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/un-p2sh/:txId', async ({ params }: $Request, res: $Response) => {
  try {
    const sql = 'SELECT output_data FROM UnP2sh WHERE tx_id = ${tx_id}'
    const result = await Db.any(sql, objToSnakeCase(params))
    if (result.length && result[0].output_data) {
      const data = JSON.parse(result[0].output_data)
      res.status(200).json(data.map(objToCamelCase))
    } else {
      throw new Error(`no data found for txId ${params.txId}`)
    }
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
})

app.post('/txos/set-spent/', async ({ body }: $Request, res: $Response) => {
  if (!body || typeof body !== 'object')
    throw new Error('Parameter must be an object')

  try {
    const sql =
      'UPDATE Txos SET spent = true WHERE tx_id = ${tx_id} AND v_out = ${v_out}'
    await Db.none(sql, objToSnakeCase(body))
    res.status(201).json({})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/txos/:publicKey', async ({ params }: $Request, res: $Response) => {
  try {
    const sql =
      'SELECT tx_id, v_out FROM Txos WHERE public_key = ${public_key} and spent = false'
    const result: Array<any> = await Db.any(sql, objToSnakeCase(params))
    res.status(200).json(result.map(objToCamelCase))
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
})

export default app
