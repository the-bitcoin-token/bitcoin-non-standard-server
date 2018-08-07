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
      tx_id varchar(20) primary key,
      public_key varchar(20) NOT NULL,
      data_outputs text[] default NULL
    );`
    return this._db.none(sql)
  }

  static async dropDataOutputsTable() {
    const sql = `DROP TABLE DataOutputs;`
    return this._db.none(sql)
  }

  static async checkIfDataOutputsExists() {
    const sql = `SELECT EXISTS (
      SELECT 1
      FROM   information_schema.tables 
      WHERE  table_schema = 'public'
      AND    table_name = 'dataoutputs'
      );`
    return this._db.one(sql)
  }
}
