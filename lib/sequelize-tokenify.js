'use strict';

const _ = require('lodash');
const randomstring = require('randomstring');

const DEFAULT_OPTIONS = {
    field: 'token',
    scope: [],
    length: 10,
    charset: 'alphanumeric',
};

class SequelizeTokenify {

    static tokenify(Model, options) {
        const tokenOptions = _.defaults(options, DEFAULT_OPTIONS);
        const postfix = _.upperFirst(_.camelCase(tokenOptions.field));

        const generateToken = function (options) {
            let value = randomstring.generate({
                length: tokenOptions['length'],
                charset: tokenOptions['charset'],
            });

            let conditions = {};
            conditions[tokenOptions.field] = value;
            _.each(tokenOptions.scope, (field) => {
                conditions[field] = this[field];
            });

            return Model.count({where: conditions}, options).then((count) => {
                if (count > 0) {
                    return generateToken.call(this, options);
                } else {
                    this[tokenOptions.field] = value;
                    return value;
                }
            });
        };

        const handleTokenify = function (instance, options) {
            if (!instance[tokenOptions.field]) {
                return generateToken.call(instance, options);
            }
        };

        // Generate token method
        (Model.Instance || Model).prototype[`generate${postfix}`] = generateToken;

        // Update token method
        (Model.Instance || Model).prototype[`update${postfix}`] = function (options) {
            return generateToken.call(this, options).then(() => {
                return this.save();
            });
        };

        Model.beforeCreate(`handleTokenify${postfix}`, handleTokenify);
        Model.beforeUpdate(`handleTokenify${postfix}`, handleTokenify);
    }

}

module.exports = SequelizeTokenify;
