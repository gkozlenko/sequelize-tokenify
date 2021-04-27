# sequelize-tokenify

[![Build Status](https://travis-ci.org/gkozlenko/sequelize-tokenify.svg?branch=master)](https://travis-ci.org/gkozlenko/sequelize-tokenify)
[![npm Version](https://img.shields.io/npm/v/sequelize-tokenify.svg)](https://www.npmjs.com/package/sequelize-tokenify)
[![Maintainability](https://api.codeclimate.com/v1/badges/d70ff40c820582c990cb/maintainability)](https://codeclimate.com/github/gkozlenko/sequelize-tokenify/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d70ff40c820582c990cb/test_coverage)](https://codeclimate.com/github/gkozlenko/sequelize-tokenify/test_coverage)
[![GitHub License](https://img.shields.io/github/license/gkozlenko/sequelize-tokenify.svg)](https://github.com/gkozlenko/sequelize-tokenify/blob/master/LICENSE)
[![Donate using PayPal](https://img.shields.io/badge/paypal-donate-green.svg)](https://www.paypal.me/pipll)
[![Buy me a Coffee](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-green.svg)](https://www.buymeacoffee.com/NIUeF95)

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
