# sequelize-tokenify

[![build status](https://github.com/gkozlenko/sequelize-tokenify/actions/workflows/node.js.yml/badge.svg)](https://github.com/gkozlenko/sequelize-tokenify/actions/workflows/node.js.yml)
[![test coverage](https://gkozlenko.github.io/sequelize-tokenify/badges/coverage.svg)](https://github.com/gkozlenko/sequelize-tokenify/actions/workflows/node.js.yml)
[![npm version](https://img.shields.io/npm/v/sequelize-tokenify.svg)](https://www.npmjs.com/package/sequelize-tokenify)
[![license](https://img.shields.io/github/license/gkozlenko/sequelize-tokenify.svg)](https://github.com/gkozlenko/sequelize-tokenify/blob/master/LICENSE)

Add unique tokens to sequelize models

## Installation

```bash
$ npm install sequelize-tokenify
```

## Usage

```javascript
const SequelizeTokenify = require('sequelize-tokenify');

module.exports = function(sequelize, Sequelize) {

    var User = sequelize.define('User', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        recovery_token: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    SequelizeTokenify.tokenify(User, {
        field: 'recovery_token'
    });

    return User;
};
```

## Options

`tokenify` method takes an options array as it's second parameter.

```javascript
SequelizeTokenify.tokenify(User, {
    field: 'recovery_token'
});
```

Available options:

- `field` - Field name in the model to store token value. Default value: `token`.
- `scope` - Array of field names in the model that are used to limit the uniqueness token generation.
- `length` - Length of the token value. Default value: `10`.
- `charset` - Character set for the token value. Default value: `alphanumeric`. Available values:
    - `alphanumeric` - `[0-9a-zA-Z]`
    - `alphabetic` - `[a-zA-Z]`
    - `numeric` - `[0-9]`
    - `hex` - `[0-9a-f]`

All options are optional.

## Methods

`sequelize-tokenify` module creates several instance methods with names depend on the token field:

- `generate[TokenField]` - Generates a new token without saving the model.
- `update[TokenField]` - Generates a new token and saves the model.

Every this method accepts one optional parameter - `options`.

For `recovery_token` field module will create these methods:

- `generateRecoveryToken`
- `updateRecoveryToken`

So you can use this module several times for the same model:

```javascript
var SequelizeTokenify = require('sequelize-tokenify');

module.exports = function(sequelize, Sequelize) {

    var User = sequelize.define('User', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        token: {
            type: Sequelize.STRING,
            unique: true
        },
        recovery_token: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    // For token field
    SequelizeTokenify.tokenify(User);

    // For recovery_token field
    SequelizeTokenify.tokenify(User, {
        field: 'recovery_token'
    });

    return User;
};
```
