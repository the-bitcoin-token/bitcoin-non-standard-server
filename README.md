# Bitcoin Non-Standard server

A simple server to store p2sh script preimages. To be used in conjunction with BitcoinToken.

## Installation

### Using Docker Compose

Assuming [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) are installed on the system run:

    git clone https://github.com/BitcoinDB/bitcoin-non-standard-server.git
    cd bitcoin-non-standard-server/
    docker-compose up
    
After the compose has built the containers and started the stack the Bitcoin non standard server should be listening on localhost:3000.

### Manually 

#### Download and build the project

Type the following into a terminal window.

    git clone https://github.com/BitcoinDB/bitcoin-non-standard-server.git
    cd bitcoin-non-standard-server/
    npm install
    npm run build

#### Install PostgreSQL

See the <a href='https://www.postgresql.org/download/'>PostgreSQL documentation</a> for instructions

#### Set up database connection

Copy the `.env.example` file to `.env` and set the Postgres credentials (database name, user, pass, ...) in it. 

#### Create a database

   npm run init

If the database creation completed successfully you should see

    Created database bitcoin_non_standard.
    Successfully created required database tables.

#### Start the server

To start the server type

    npm run serve

If everything went well, you should see the following output

    Bitcoin non-standard server listening on port 3000

### Test

To run the unit tests start the server by running ```npm run serve``` in one terminal window. Then open a second terminal and run ```npm test```.

### Get help

If you have any problems contact clemens@bitcointoken.com.
