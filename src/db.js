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

  static async createUnP2shTable() {
    const sql = `CREATE TABLE UnP2sh (
      tx_id varchar(64) primary key,
      output_data text default NULL
    );`
    return this._db.none(sql)
  }

  static async dropUnP2shTable() {
    const sql = `DROP TABLE UnP2sh;`
    return this._db.none(sql)
  }

  static none(...params: Array<any>) {
    return this._db.none(...params)
  }

  static any(...params: Array<any>) {
    return this._db.any(...params)
  }
}
