# Blockchain Star Notary Service

A Blockchain Star Notary Service implemented in node-js with express-js

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Installing

Install libraries.

```
npm install
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

## Star information example
{
    "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "star": {
        "dec": "68° 52' 56.9",
        "ra": "16h 29m 1.0s",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
       }
}

## Endpoints

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`   | `{host}:8000/requestValidation`            | Make a validation request with body of your wallet address ex.{ "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }                  |
| `POST`   | `{host}:8000/message-signature/validate `            | Make a validation request with body of your wallet address ex.{"address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL","signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="}                  |
| `POST`   | `{host}:8000/block`            | Create a new block. Provide the data of the block using body of star information                      |
| `GET`    | `{host}:8000/block/{block height}`| Retrieve information of the block of the height                      |
| `GET`    | `{host}:8000/stars/hash/{star hash}`| Retrieve information of the block of the hash                      |
| `GET`    | `{host}:8000/stars/address/{wallet address}`| Retrieve information of the blocks of the wallet                      |


## Authors

* **Jihyun Son** - [Github](https://github.com/sonjh1217)

