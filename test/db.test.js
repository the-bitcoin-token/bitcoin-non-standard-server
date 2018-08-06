// @flow

/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */

import Db from '../src/db'

declare var describe: any
declare var it: any
declare var expect: any

describe('init', async () => {
  it.only('should create a new DB', async () => {
    expect(Db._db).toBeUndefined()
    Db.init()
    expect(Db._db).toBeDefined()

    // test that DB._db is working
    const db = Db._db
    const data = await db.one('SELECT $1 AS value', 123)
    expect(data.value).toBe(123)

    // close connection pool
    Db._db.$pool.end()
  })
})
