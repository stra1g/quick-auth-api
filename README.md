<p align="center">
  <a href="https://www.typescriptlang.org/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" width="200" alt="Typescript logo" /></a>
</p>

<p align="center">
  Server-side app providing secure authentication and authorization services for accessing protected resources.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />
</p>

## Table of contents
* [Use Cases](#use-cases)
* [Technologies](#technologies)
* [Installation](#installation)
* [Running the app](#running-the-app)
* [Tests](#tests)

## Use Cases
- Users can sign up by providing name, email and password;
- Users can sign in by providing an email and password;
- Users can sign up and sign in by connecting their Google account;

## Technologies
- Typescript
- Node.js
- NestJS
- PostgreSQL
- Docker / Docker Compose
- Passport
- Jest

## Installation

```bash
$ npm install
$ yarn
```

## Running the app

```bash
# development
$ npm run start
$ yarn start

# watch mode
$ npm run start:dev
$ yarn start:dev

# production mode
$ npm run start:prod
$ yarn start:prod
```

## Tests

```bash
# unit tests
$ npm run test
$ yarn test

# e2e tests
$ npm run test:
$ yarn test:e2e

# test coverage
$ npm run test:cov
$ yarn test:cov
```

## License

[MIT licensed](LICENSE).
