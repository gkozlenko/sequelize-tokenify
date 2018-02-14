'use strict';

var Sequelize = require('sequelize');
var Promise = require('bluebird');

var dbUsername = process.env.DB_USER || 'root';
var dbPassword = process.env.DB_PW || null;
var sequelize = new Sequelize('sequelize_tokenify_test', dbUsername, dbPassword, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    operatorsAliases: false
});

var SequelizeTokenify = require('../index');

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;

function generateModel(name) {
    return sequelize.define(name, {
        token: {
            type: Sequelize.STRING
        },
        code: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        }
    });
}

var Model = {};
var modelId = 0;

describe('sequelize-tokenify', function () {
    this.timeout(10000);

    describe('tokens', function () {

        beforeEach(function () {
            Model = generateModel('model' + modelId);
            modelId++;
            return sequelize.sync({force: true});
        });

        it('should create a token width default options', function () {
            SequelizeTokenify.tokenify(Model);

            return Model.create().then(function (instance) {
                return expect(instance.token).to.not.be.empty;
            });
        });

        it('should create a token width specified options', function () {
            SequelizeTokenify.tokenify(Model, {
                field: 'code',
                length: 6,
                charset: 'numeric'
            });

            return Model.create().then(function (instance) {
                return [
                    expect(instance.token).to.be.undefined,
                    expect(instance.code).to.not.be.empty,
                    expect(instance.code).to.not.match(/[a-zA-Z]/),
                    expect(instance.code.length).to.eq(6)
                ];
            });
        });

        it('should create a unique token', function () {
            SequelizeTokenify.tokenify(Model, {
                length: 1,
                charset: 'numeric'
            });

            return Promise.all(['0', '1', '2', '3', '4', '5', '6', '7', '8'].map(function (token) {
                return Model.create({token: token});
            })).then(function () {
                return Model.create().then(function (instance) {
                    return expect(instance.token).to.eq('9');
                });
            });
        });

        it('should create a unique token in a scope', function () {
            SequelizeTokenify.tokenify(Model, {
                length: 1,
                charset: 'numeric',
                scope: ['type']
            });

            return Promise.all(['0', '1', '2', '3', '4', '5', '6', '7', '8'].map(function (token) {
                return Model.create({token: token, type: 'test'});
            })).then(function () {
                return Model.create({token: '7', type: 'other'});
            }).then(function () {
                return Model.create({type: 'test'}).then(function (instance) {
                    return expect(instance.token).to.eq('9');
                }).then(function () {
                    return Model.create({type: 'other'}).then(function (instance) {
                        return expect(instance.token).to.not.eq('7');
                    });
                });
            });
        });

        it('should not update token', function () {
            SequelizeTokenify.tokenify(Model);

            return Model.create({token: 'test-token'}).then(function (instance) {
                instance.code = 'new.code';
                return instance.save().then(function (instance) {
                    return expect(instance.token).to.eq('test-token');
                });
            });
        });

        it('should update token', function () {
            var instance = null;
            return Model.create().then(function (inst) {
                instance = inst;
                return expect(instance.token).to.be.undefined;
            }).then(function () {
                SequelizeTokenify.tokenify(Model);
                instance.code = 'new.code';
                return instance.save().then(function (instance) {
                    return expect(instance.token).to.not.be.empty;
                });
            });
        });

        it('should generate a new token', function () {
            SequelizeTokenify.tokenify(Model);

            var instance = null;
            return Model.create().then(function (inst) {
                instance = inst;
                return expect(instance.generateToken).to.be.instanceof(Function);
            }).then(function () {
                var lastToken = instance.token;
                return instance.generateToken().then(function (token) {
                    return expect(token).to.not.be.eq(lastToken);
                });
            });
        });

        it('should update a new token', function () {
            SequelizeTokenify.tokenify(Model);

            var instance = null;
            return Model.create().then(function (inst) {
                instance = inst;
                return expect(instance.updateToken).to.be.instanceof(Function);
            }).then(function () {
                var lastToken = instance.token;
                return instance.updateToken().then(function (instance) {
                    return expect(instance.token).to.not.be.eq(lastToken);
                });
            });
        });
    });

    after(function () {
        return sequelize.close();
    });

});
