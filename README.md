# Bitcoin Non-Standard server

A simple server to store p2sh script preimages. To be used in conjunction with BitcoinToken.

## Installation

### Checkout project

Type the following into a terminal.

```
git clone git@github.com:BitcoinDB/bitcoin-non-standard-server.git
```

### Install PostgreSQL

See the <a href='https://www.postgresql.org/download/'>PostgreSQL documentation</a> for instructions

### Create a database

Type ```psql``` into your console to open the PostgreSQL interactive terminal. To create a new database called ```non-standard-db``` type in
```
CREATE DATABASE non-standard-db;
```

To create database schema type in the following

```
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
```

### Set up environment variables

Create a file called ```.env``` in the root directory with the following content
```
PORT=3000
PGUSER=<your PostgreSQL username>
PGPASSWORD=<your PostgreSQL password>
PGHOST=localhost
PGPORT=5432
PGDATABASE=non-standard-db
```

### Start the server

To start the server type
```
npm run serve
```

If everything went well, you should see the following output
```
Bitcoin non-standard server listening on port 3000
```

### Get help

If you have any problems contact clemens@bitcointoken.com.
