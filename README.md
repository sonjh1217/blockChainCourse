# Blockchain Web-service

A blockchain web-service implemented in node-js with express-js

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Installing

Install libraries.

```
npm init
```


## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

## Deployment

```
node app.js
```

## Endpoints

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `{host}:8000/block/{block height}`| Retrieve information of the block of the height                      |
| `POST`   | `{host}:8000/block`            | Create a new block. Provide the data of the block using body ex. {"data": "The New Block"}                      |


## Authors

* **Jihyun Son** - [Github](https://github.com/sonjh1217)

