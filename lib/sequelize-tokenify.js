'use strict';

var _ = require('lodash');
var Promise = require('bluebird');

var SequelizeTokenify = {};

SequelizeTokenify.prototype.tokenify = function(Model, options) {

    var tokenOptions = _.defaults({}, {
        field: 'token',
        scope: [],
        length: 10
    }, options);

    var generateToken = function(options) {
        
    };

    var handleTokenify = function(instance, options) {
        return Promise.resolve().then(function() {
            if (!instance[tokenOptions.field]) {
                return generateToken.call(instance, options);
            }
        });
    };

    Model.beforeCreate('handleTokenify', handleTokenify);
    Model.beforeUpdate('handleTokenify', handleTokenify);
}

module.exports = new SequelizeTokenify();