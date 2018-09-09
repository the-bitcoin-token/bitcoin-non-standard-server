// @flow
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */

import * as RestClient from './lib/RestClient'
import Db from '../src/db'

declare var afterAll: any
declare var beforeAll: any
declare var describe: any
declare var it: any
declare var expect: any

describe('App', async () => {
  beforeAll(async () => {
    Db.getConnection()
    await Db.dropSchema()
    await Db.createSchema()
  })

  describe('postDataOutputs', async () => {
    it('Should issue a post request to store an empty array of data outputs', async () => {
      const random = Math.round(Math.random() * 1000)
      const data = {
        txId: `txId${random}`,
        outputData: '[]'
      }

      const res = await RestClient.postDataOutputs(data)
      expect(res).toEqual({})
    })

    it('Should issue a post request to store a singleton array of data outputs', async () => {
      const random = Math.round(Math.random() * 1000)
      const data = {
        txId: `txId${random}`,
        outputData: '[{"publicKeys":["abc"],"data":["a"]}]'
      }

      const res = await RestClient.postDataOutputs(data)
      expect(res).toEqual({})
    })

    it('Should issue a post request to store a longer array of data outputs', async () => {
      const random = Math.round(Math.random() * 1000)
      const data = {
        txId: `txId${random}`,
        outputData:
          '[{"publicKeys":["abc"],"data":["a"]}, {"publicKeys":["cba"],"data":["b"]}]'
      }

      const res = await RestClient.postDataOutputs(data)
      expect(res).toEqual({})
    })
  })

  describe('getDataOutputs', async () => {
    it('Should retrieve empty data outputs from the server', async () => {
      const random = Math.round(Math.random() * 1000)
      const data = {
        txId: `txId${random}`,
        outputData: '[]'
      }
      await RestClient.postDataOutputs(data)

      const res = await RestClient.getDataOutputs(data.txId)
      expect(res).toBeDefined()
      expect(res.length).toBe(0)
    })

    it('Should retrieve non empty data outputs from the server', async () => {
      const random = Math.round(Math.random() * 1000)
      const publicKeyHex =
        '0240479435fb455e40cca98fc37d497ae36fc91b6f426ca30e651bc27a36c70d99'
      const dataString = 'a'
      const data = {
        txId: `txId${random}`,
        outputData: `[{"publicKeys":["${publicKeyHex}"],"data":["${dataString}"]}]`
      }

      await RestClient.postDataOutputs(data)

      const res = await RestClient.getDataOutputs(data.txId)
      expect(res).toBeDefined()
      expect(res.length).toBe(1)
      expect(res[0].publicKeys).toBeDefined()
      expect(res[0].publicKeys.length).toBeDefined()
      expect(res[0].publicKeys[0]).toBeDefined()
      expect(res[0].publicKeys[0]).toBe(publicKeyHex)
      expect(res[0].data).toBeDefined()
      expect(res[0].data.length).toBeDefined()
      expect(res[0].data[0]).toBe(dataString)
    })
  })

  describe('getTokenUtxos', async () => {
    it('Should retrieve empty txos from the server', async () => {
      const random = Math.round(Math.random() * 1000)
      const data = {
        txId: `txId${random}`,
        outputData: '[]'
      }
      await RestClient.postDataOutputs(data)

      const res = await RestClient.getTokenUtxos(data.txId)
      expect(res).toBeDefined()
      expect(res.length).toBe(0)
    })

    it('Should retrieve non empty txos from the server', async () => {
      const random = Math.round(Math.random() * 1000)
      const publicKeyHex1 = `publicKeyHex1${random}`
      const dataString1 = 'a'
      const publicKeyHex2 = `publicKeyHex2${random}`
      const dataString2 = 'b'
      const data = {
        txId: `txId${random}`,
        outputData: `[
          {"publicKeys":["${publicKeyHex1}"],"data":["${dataString1}"]},
          {"publicKeys":["${publicKeyHex2}"],"data":["${dataString2}"]}
        ]`
      }
      await RestClient.postDataOutputs(data)

      const res1 = await RestClient.getTokenUtxos(publicKeyHex1)
      expect(res1).toBeDefined()
      expect(res1.length).toBe(1)
      expect(res1[0].txId).toBe(data.txId)
      expect(res1[0].vOut).toBe(0)

      const res2 = await RestClient.getTokenUtxos(publicKeyHex2)
      expect(res2).toBeDefined()
      expect(res2.length).toBe(1)
      expect(res2[0].txId).toBe(data.txId)
      expect(res2[0].vOut).toBe(1)
    })
  })

  describe('setTxoSpent', async () => {
    it('Should set "spent" to true on the server side db', async () => {
      const random1 = Math.round(Math.random() * 1000)
      const random2 = Math.round(Math.random() * 1000)
      const publicKeyHex =
        '0240479435fb455e40cca98fc37d497ae36fc91b6f426ca30e651bc27a36c70d99'
      const dataString = 'a'
      const data1 = {
        txId: `txId${random1}`,
        outputData: `[{"publicKeys":["${publicKeyHex}"],"data":["${dataString}"]}]`
      }
      const data2 = {
        txId: `txId${random2}`,
        outputData: `[{"publicKeys":["${publicKeyHex}"],"data":["${dataString}"]}]`
      }

      await RestClient.postDataOutputs(data1)
      await RestClient.postDataOutputs(data2)

      const res1 = await RestClient.getTokenUtxos(publicKeyHex)

      let exists = res1.find(el => el.txId === data1.txId)
      expect(exists).toBeDefined()

      await RestClient.setTxoSpent(data1.txId, 0)
      const res2 = await RestClient.getTokenUtxos(publicKeyHex)

      exists = res2.find(el => el.txId === data1.txId)
      expect(exists).toBeUndefined()
    })
  })

  afterAll(async () => {
    Db._db.$pool.end()
  })
})
