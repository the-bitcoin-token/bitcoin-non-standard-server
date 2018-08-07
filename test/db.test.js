// @flow

/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */

import Db from '../src/db'

declare var describe: any
declare var it: any
declare var expect: any
declare var beforeEach: any
declare var afterEach: any
declare var beforeAll: any
declare var afterAll: any

describe('Db', async () => {
  beforeAll(async () => {
    expect(Db._db).toBeUndefined()
    Db.getConnection()
    expect(Db._db).toBeDefined()
  })

  beforeEach(async () => {
    try {
      await Db.dropDataOutputsTable()
    } catch (err) {
      if (err.message !== 'table "dataoutputs" does not exist') {
        throw err
      }
    }
  })

  describe('getConnection', async () => {
    it('should create a new DB', async () => {
      // test that DB._db is working
      const data = await Db._db.one('SELECT $1 AS value', 123)
      expect(data.value).toBe(123)
    })
  })

  describe('createDataOutputsTable', async () => {
    it('should create the DataOutputs table', async () => {
      await Db.createDataOutputsTable()
      const data = await Db._db.none('SELECT * FROM DataOutputs;')
      expect(data).toBe(null)
    })

    it('should throw an error if table is created twice', async () => {
      await Db.createDataOutputsTable()

      await expect(Db.createDataOutputsTable()).rejects.toThrow(
        'relation "dataoutputs" already exists'
      )
    })
  })

  describe('dropDataOutputsTable', async () => {
    it('should drop the DataOutputs table', async () => {
      // querying DataOutputs should throw an error if it does not exist yet
      await expect(Db._db.none('SELECT * FROM DataOutputs;')).rejects.toThrow(
        'relation "dataoutputs" does not exist'
      )

      // querying DataOutputs should work after it is created
      await Db.createDataOutputsTable()
      const data = await Db._db.none('SELECT * FROM DataOutputs;')
      expect(data).toBe(null)

      // querying DataOutputs should throw an error after it has been dropped
      await Db.dropDataOutputsTable()
      await expect(Db._db.none('SELECT * FROM DataOutputs;')).rejects.toThrow(
        'relation "dataoutputs" does not exist'
      )
    })

    it('should throw an error if DataOutputs is dropped twice', async () => {
      await Db.createDataOutputsTable()
      await Db.dropDataOutputsTable()

      await expect(Db.dropDataOutputsTable()).rejects.toThrow(
        'table "dataoutputs" does not exist'
      )
    })
  })

  afterAll(async () => {
    Db._db.$pool.end()
  })
})
