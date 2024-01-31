# Food Service

This is a lightweight service for making food orders.

## Installation

```bash 
 # install packages
$ npm install

# start docker for postgres
$ docker-compose up -d

# Run migrations and seed database
$ npx prisma migrate dev
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The service would be live with a Swagger documentation at [localhost:3000/api](http://localhost:3000/api)

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

