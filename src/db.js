// @flow
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_db"] }] */

import pgPromise from 'pg-promise'
import 'dotenv/config'

declare var process: {
  env: {
    UNIT_TESTING: boolean,
    PGUSER: string,
    PGPASSWORD: string,
    PGDATABASE: string,
    PGHOST: string,
    PGPORT: number
  }
}

export default class Db {
  static _db: Object

  static getConnection(): void {
    // make sure that only one db connection is created
    if (this._db) return

    // otherwise create a new connection
    const pgp = pgPromise({})
    const {
      env: { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE }
    } = process
    const cn = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`
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
      virtual_index integer NOT NULL,
      spent boolean NOT NULL
    );
    `
    return this._db.none(sql)
  }

  static async dropSchema() {
    const dropUnP2sh = `DROP TABLE IF EXISTS UnP2sh;`
    await this._db.none(dropUnP2sh)

    const dropTxos = `DROP TABLE IF EXISTS Txos;`
    await this._db.none(dropTxos)
  }

  static async truncateDb() {
    const truncateUnP2sh = `TRUNCATE UnP2sh;`
    await this._db.none(truncateUnP2sh)

    const truncateTxos = `TRUNCATE EXISTS Txos;`
    await this._db.none(truncateTxos)
  }

  static none(...params: Array<any>) {
    return this._db.none(...params)
  }

  static any(...params: Array<any>) {
    return this._db.any(...params)
  }
}
