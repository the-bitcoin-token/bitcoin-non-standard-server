// @flow
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */

import WebSocket from 'isomorphic-ws'
import * as RestClient from './lib/RestClient'
import Db from '../src/db'

declare var afterAll: any
declare var beforeAll: any
declare var describe: any
declare var it: any
declare var expect: any

const msg = Math.random().toString()

describe('App', async () => {
  beforeAll(async () => {
    Db.getConnection()
    await Db.dropSchema()
    await Db.createSchema()
  })

  describe('web socket', async () => {
    it('should respond to a simple message', async done => {
      const ws = new WebSocket('ws://localhost:8080')

      ws.on('open', () => {
        ws.send(msg)
      })
      ws.on('close', () => done())
      ws.on('message', data => {
        expect(data).toBe(msg)
        ws.close()
      })
    })
  })

  describe('postDataOutputs', async () => {
    it('Should issue a post request to store an empty array of data outputs', async () => {
      const random = Math.round(Math.random() * 100000)
      const data = {
        txId: `txId${random}`,
        outputData: '[]'
      }

      const res = await RestClient.postDataOutputs(data)
      expect(res.data).toEqual({})
      expect(res.status).toEqual(201)
    })

    it('Should issue a post request to store a singleton array of data outputs', async () => {
      const random = Math.round(Math.random() * 100000)
      const data = {
        txId: `txId${random}`,
        outputData: '[{"publicKeys":["abc"],"data":["a"]}]'
      }

      const res = await RestClient.postDataOutputs(data)
      expect(res.data).toEqual({})
      expect(res.status).toEqual(201)
    })

    it('Should issue a post request to store a longer array of data outputs', async () => {
      const random = Math.round(Math.random() * 100000)
      const data = {
        txId: `txId${random}`,
        outputData:
          '[{"publicKeys":["abc"],"data":["a"]}, {"publicKeys":["cba"],"data":["b"]}]'
      }

      const res = await RestClient.postDataOutputs(data)
      expect(res.data).toEqual({})
      expect(res.status).toEqual(201)
    })
  })

  describe('getDataOutputs', async () => {
    it('Should retrieve empty data outputs from the server', async () => {
      const random = Math.round(Math.random() * 100000)
      const data = {
        txId: `txId${random}`,
        outputData: '[]'
      }
      await RestClient.postDataOutputs(data)

      const res = await RestClient.getDataOutputs(data.txId)
      expect(res.data).toBeDefined()
      expect(res.data.length).toBe(0)
      expect(res.status).toEqual(200)
    })

    it('Should retrieve non empty data outputs from the server', async () => {
      const random = Math.round(Math.random() * 100000)
      const publicKeyHex =
        '0240479435fb455e40cca98fc37d497ae36fc91b6f426ca30e651bc27a36c70d99'
      const dataString = 'a'
      const data = {
        txId: `txId${random}`,
        outputData: `[{"publicKeys":["${publicKeyHex}"],"data":["${dataString}"]}]`
      }

      await RestClient.postDataOutputs(data)

      const res = await RestClient.getDataOutputs(data.txId)
      expect(res.data).toBeDefined()
      expect(res.data.length).toBe(1)
      expect(res.data[0].publicKeys).toBeDefined()
      expect(res.data[0].publicKeys.length).toBeDefined()
      expect(res.data[0].publicKeys[0]).toBeDefined()
      expect(res.data[0].publicKeys[0]).toBe(publicKeyHex)
      expect(res.data[0].data).toBeDefined()
      expect(res.data[0].data.length).toBeDefined()
      expect(res.data[0].data[0]).toBe(dataString)
      expect(res.status).toEqual(200)
    })
  })

  describe('getTokenUtxos', async () => {
    it('Should retrieve empty txos from the server', async () => {
      const random = Math.round(Math.random() * 100000)
      const data = {
        txId: `txId${random}`,
        outputData: '[]'
      }
      await RestClient.postDataOutputs(data)

      const res = await RestClient.getTokenUtxos(data.txId)
      expect(res.data).toBeDefined()
      expect(res.data.length).toBe(0)
      expect(res.status).toEqual(200)
    })

    it('Should retrieve non empty txos from the server', async () => {
      const random = Math.round(Math.random() * 100000)
      const publicKeyHex1 = `publicKeyHex1${random}`
      const dataString1 = 'a'
      const publicKeyHex2 = `publicKeyHex2${random}`
      const dataString2 = 'b'
      const data = {
        txId: `txId${random}`,
        outputData: `[
          {"__publicKeys":["${publicKeyHex1}"],"data":["${dataString1}"], "__kind": "script"},
          {"__publicKeys":["${publicKeyHex2}"],"data":["${dataString2}"], "__kind": "script"}
        ]`
      }
      await RestClient.postDataOutputs(data)

      const res1 = await RestClient.getTokenUtxos(publicKeyHex1)

      expect(res1.data).toBeDefined()
      expect(res1.data.length).toBe(1)
      expect(res1.data[0].txId).toBe(data.txId)
      expect(res1.data[0].vOut).toBe(0)
      expect(res1.status).toEqual(200)

      const res2 = await RestClient.getTokenUtxos(publicKeyHex2)
      expect(res2.data).toBeDefined()
      expect(res2.data.length).toBe(1)
      expect(res2.data[0].txId).toBe(data.txId)
      expect(res2.data[0].vOut).toBe(1)
      expect(res2.status).toEqual(200)
    })
  })

  describe('setTxoSpent', async () => {
    it('Should set "spent" to true on the server side db', async () => {
      const random1 = Math.round(Math.random() * 100000)
      const random2 = Math.round(Math.random() * 100000)
      const publicKeyHex =
        '0240479435fb455e40cca98fc37d497ae36fc91b6f426ca30e651bc27a36c70d99'
      const dataString = 'a'
      const data1 = {
        txId: `txId${random1}`,
        outputData: `[{"__publicKeys":["${publicKeyHex}"],"data":["${dataString}"], "__kind": "script"}]`
      }
      const data2 = {
        txId: `txId${random2}`,
        outputData: `[{"__publicKeys":["${publicKeyHex}"],"data":["${dataString}"], "__kind": "script"}]`
      }

      await RestClient.postDataOutputs(data1)
      await RestClient.postDataOutputs(data2)

      const res1 = await RestClient.getTokenUtxos(publicKeyHex)
      expect(res1.status).toEqual(200)

      let exists = res1.data.find(el => el.txId === data1.txId)
      expect(exists).toBeDefined()

      const resSpent = await RestClient.setTxoSpent(data1.txId, 0)
      expect(resSpent.status).toEqual(201)

      const res2 = await RestClient.getTokenUtxos(publicKeyHex)
      expect(res2.status).toEqual(200)

      exists = res2.data.find(el => el.txId === data1.txId)
      expect(exists).toBeUndefined()
    })
  })

  afterAll(async () => {
    Db._db.$pool.end()
  })
})
