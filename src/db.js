// @flow
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */

import pgPromise from 'pg-promise'

export default class Db {
  static _db: Object

  static getConnection(): void {
    // make sure that only one db connection is created
    if (this._db) return

    // otherwise create a new connection
    const pgp = pgPromise({})
    const cn = 'postgres://clemensley:@localhost:5432/unp2sh'
    this._db = pgp(cn)
  }

  static async createDataOutputsTable() {
    const sql = `CREATE TABLE DataOutputs (
      txId varchar(20) primary key,
      publicKey varchar(20) NOT NULL,
      outputData text default NULL
      read boolean default false
    );`
    return this._db.none(sql)
  }

  static async dropDataOutputsTable() {
    const sql = `DROP TABLE DataOutputs;`
    return this._db.none(sql)
  }
}
