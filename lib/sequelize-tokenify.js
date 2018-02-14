'use strict';

var _ = require('lodash');
var randomstring = require('randomstring');

var SequelizeTokenify = function () {
};

SequelizeTokenify.prototype.tokenify = function (Model, options) {

    var tokenOptions = _.defaults(options, {
        field: 'token',
        scope: [],
        length: 10,
        charset: 'alphanumeric'
    });

    var postfix = _.upperFirst(_.camelCase(tokenOptions.field));

    var generateToken = function (options) {
        var instance = this;
        var value = randomstring.generate({
            length: tokenOptions['length'],
            charset: tokenOptions['charset']
        });
        var conditions = {};
        conditions[tokenOptions.field] = value;
        _.each(tokenOptions.scope, function (field) {
            conditions[field] = instance[field];
        });
        return Model.count({where: conditions}, options).then(function (count) {
            if (count > 0) {
                return generateToken.call(instance, options);
            } else {
                instance[tokenOptions.field] = value;
                return value;
            }
        });
    };

    var handleTokenify = function (instance, options) {
        if (!instance[tokenOptions.field]) {
            return generateToken.call(instance, options);
        }
    };

    // Generate token method
    (Model.Instance || Model).prototype['generate' + postfix] = generateToken;

    // Update token method
    (Model.Instance || Model).prototype['update' + postfix] = function (options) {
        var instance = this;
        return generateToken.call(instance, options).then(function () {
            return instance.save();
        });
    };

    Model.beforeCreate('handleTokenify' + postfix, handleTokenify);
    Model.beforeUpdate('handleTokenify' + postfix, handleTokenify);
};

module.exports = new SequelizeTokenify();
