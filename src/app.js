// @flow
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */
/* eslint no-template-curly-in-string: "off" */

import express from 'express'
import bodyParser from 'body-parser'
import Db from './db'
import { objToSnakeCase, objToCamelCase } from './utils'

Db.getConnection()

const app = express()
app.use(bodyParser.json())

app.post('/', async (req: $Subtype<express$Request>, res: express$Response) => {
  try {
    // store in UnP2sh
    const insertIntoUnP2sh =
      'INSERT INTO UnP2sh(tx_id, output_data) VALUES (${tx_id}, ${output_data})'
    await Db.none(insertIntoUnP2sh, objToSnakeCase(req.body))

    // store in Txos
    const { outputData, txId } = req.body
    const outputDataObj = JSON.parse(outputData)

    const insertIntoTxos =
      'INSERT INTO Txos(public_key, tx_id, v_out, spent) VALUES (${publicKey}, ${txId}, ${vOut}, false)'
    await Promise.all(
      outputDataObj.map(
        async (element, index) =>
          typeof element === 'object'
            ? Db.none(insertIntoTxos, {
              txId,
              vOut: index,
              publicKey: element.publicKeys[0]
            })
            : Promise.resolve()
      )
    )

    res
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST')
      .status(201)
      .json({})
  } catch (err) {
    res
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST')
      .status(500)
      .json({ error: err.message })
  }
})

app.options(
  '/',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    res
      .set('Allow', 'POST')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST')
      .status(200)
      .json({})
  }
)

app.get(
  '/un-p2sh/:txId',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    try {
      const sql = 'SELECT output_data FROM UnP2sh WHERE tx_id = ${tx_id}'
      const result: Array<any> = await Db.any(sql, objToSnakeCase(req.params))
      const data = JSON.parse(result[0].output_data)
      res
        .set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Methods', 'GET')
        .status(200)
        .json(data.map(objToCamelCase))
    } catch (err) {
      res
        .set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Methods', 'GET')
        .status(404)
        .json({ error: err.message })
    }
  }
)

app.options(
  '/un-p2sh/:txId',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    res
      .set('Allow', 'GET')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'GET')
      .status(200)
      .json({})
  }
)

app.post(
  '/txos/set-spent/',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    try {
      const sql =
        'UPDATE Txos SET spent = true WHERE tx_id = ${tx_id} AND v_out = ${v_out}'
      await Db.none(sql, objToSnakeCase(req.body))
      res
        .set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Methods', 'POST')
        .status(201)
        .json({})
    } catch (err) {
      res
        .set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Methods', 'POST')
        .status(500)
        .json({ error: err.message })
    }
  }
)

app.options(
  '/txos/set-spent/',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    res
      .set('Allow', 'POST')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'POST')
      .status(200)
      .json({})
  }
)

app.get(
  '/txos/:publicKey',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    try {
      const sql =
        'SELECT tx_id, v_out FROM Txos WHERE public_key = ${public_key} and spent = false'
      const result: Array<any> = await Db.any(sql, objToSnakeCase(req.params))
      res
        .set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Methods', 'GET')
        .status(200)
        .json(result.map(objToCamelCase))
    } catch (err) {
      res
        .set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Methods', 'GET')
        .status(404)
        .json({ error: err.message })
    }
  }
)

app.options(
  '/txos/:publicKey',
  async (req: $Subtype<express$Request>, res: express$Response) => {
    res
      .set('Allow', 'GET')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Methods', 'GET')
      .status(200)
      .json({})
  }
)

export default app
