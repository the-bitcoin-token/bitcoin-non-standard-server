require('dotenv').config()
const { Client } = require('pg')

function createDbTables() {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS UnP2sh (
    tx_id varchar(64) primary key,
    output_data text NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Txos (
    id SERIAL,
    public_key varchar(66) NOT NULL,
    tx_id varchar(64) NOT NULL,
    virtual_index integer NOT NULL,
    spent boolean NOT NULL
  );
`
  const tableClient = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
  })
  tableClient.connect()
  tableClient.query(createTableQuery)
    .then(() => {
      console.log('Successfully created required database tables.')
    })
    .catch(() => {
      console.error('Could not create tables.')
      process.exit(1)
    })
    .then(() => tableClient.end())
}

const dbClient = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: 'postgres',
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
})
dbClient.connect()
dbClient.query(`CREATE DATABASE ${process.env.PGDATABASE}`)
  .then(() => {
    console.log(`Created database ${process.env.PGDATABASE}.`)
    createDbTables()
  })
  .catch(() => {
    console.log('Database already exists.')
    createDbTables()
  })
  .then(() => dbClient.end())
