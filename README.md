# Back MickBooks

This repository contains the backend of the MickBooks project. The backend is built using the NestJS framework.


## Installation

Run the following command to install the dependencies:

```bash
npm install
```


## Running the app

To run the app, you need to create a `.env` and `.env.production.local` file in the root of the project. The `.env` file should contain the values shown in the `.env.example` file.

Here is an example of the `.env` file:

```bash

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres

DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

```

To access the app locally you can use the following url:

```bash

http://localhost:3000

```


### Docker

To run the app using docker, you need to have docker installed on your machine. And have the `.env.production.local` file in the root of the project.

You can run the app using the following command:

```bash

docker compose up

```

### Local

To run the app locally, you need to have a postgres database running on your machine. You can run it using docker or install it on your machine.

To run the app locally, you can use one of the following commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode, first build the app
$ npm run build
# then run the app
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
