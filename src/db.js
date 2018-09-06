// @flow
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */

import pgPromise from 'pg-promise'

declare var process: any

export default class Db {
  static _db: Object

  static getConnection(): void {
    // make sure that only one db connection is created
    if (this._db) return

    // otherwise create a new connection
    const pgp = pgPromise({})
    const cn = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${
      process.env.PGHOST
    }:${process.env.PGPORT}/${process.env.PGDATABASE}`
    this._db = pgp(cn)
  }

  static async createSchema() {
    const sql = `
    CREATE TABLE UnP2sh (
      tx_id varchar(64) primary key,
      output_data text NOT NULL
    );

    CREATE TABLE Txos (
      id SERIAL,
      public_key varchar(66) NOT NULL,
      tx_id varchar(64) NOT NULL,
      v_out integer NOT NULL,
      spent boolean NOT NULL
    );
    `
    return this._db.none(sql)
  }

  static async dropSchema() {
    const dropUnP2sh = `DROP TABLE UnP2sh;`
    await this._db.none(dropUnP2sh)

    const dropTxos = `DROP TABLE Txos;`
    await this._db.none(dropTxos)
  }

  static none(...params: Array<any>) {
    return this._db.none(...params)
  }

  static any(...params: Array<any>) {
    return this._db.any(...params)
  }
}
