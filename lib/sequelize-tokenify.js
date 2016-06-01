'use strict';

var _ = require('lodash');
var randomstring = require('randomstring');
var Promise = require('bluebird');

var SequelizeTokenify = function () { };

SequelizeTokenify.prototype.tokenify = function (Model, options) {

    var tokenOptions = _.defaults(options, {
        field: 'token',
        scope: [],
        length: 10,
        charset: 'alphanumeric'
    });

    var generateToken = function (options) {
        var instance = this;
        var value = randomstring.generate({
            length: tokenOptions['length'],
            charset: tokenOptions['charset']
        });
        var conditions = {};
        conditions[tokenOptions.field] = value;
        _.each(tokenOptions.scope, function(field) {
            conditions[field] = instance[field];
        });
        return Model.count({where: conditions}, options).then(function(count) {
            if (count > 0) {
                return generateToken.call(instance, options);
            } else {
                instance[tokenOptions.field] = value;
            }
        });
    };

    var handleTokenify = function (instance, options) {
        return Promise.resolve().then(function () {
            if (!instance[tokenOptions.field]) {
                return generateToken.call(instance, options);
            }
        });
    };

    Model.beforeCreate('handleTokenify', handleTokenify);
    Model.beforeUpdate('handleTokenify', handleTokenify);
};

module.exports = new SequelizeTokenify();
