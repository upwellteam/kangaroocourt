var debug = require('debug')('kangaroo:models:user');

var uuid = require('uuid'),
    Promise = require('bluebird');

var app = require('../app'),
    config = app.get('config'),
    utils = require('../utils');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING(128),
            allowNull : false,
            validate : { len: [4,128] }
        },
        firstName : {
            type: DataTypes.STRING(128),
            allowNull : false
        },
        email: {
            type: DataTypes.STRING(64),
            allowNull : false,
            unique: true,
            validate : { len: [7,64], isEmail: true }
        },
        imgUrl: {
            type: DataTypes.STRING(64),
            allowNull : true,
            unique: true
        }
    }, {
        paranoid : true,
        setterMethods : {},
        classMethods : {
            associate : function(models) {},
            register : function (input) {
                var models = app.get('models');

                return new Promise(function(resolve, reject) {
                    models.User
                        .create(input)
                        .then(function(result){
                            resolve({ user : result })
                        })
                        .catch(reject);
                });
            }
        },
        instanceMethods: {
            toJSON : function () {
                var result;

                result = utils.pick(this, 'id name email createdAt updatedAt');

                return result;
            },
            generateToken : function() {
                var self = this,
                    models = app.get('models'),
                    redis = app.get('redis'),
                    token = {
                        token_type : 'Bearer',
                        expires_in : config.redis.lifetime,
                        access_token : uuid.v4(),
                        refresh_token : uuid.v4()
                    };

                return new Promise(function(resolve, reject) {
                    Promise
                        .all([
                            models.RefreshToken
                                .create({
                                    UserId : self.id,
                                    access : token.access_token,
                                    refresh : token.refresh_token
                                }),
                            redis
                                .set(token.access_token, self.id)
                                .then(function(){
                                    return redis.expire(token.access_token, config.redis.lifetime)
                                })
                        ])
                        .then(function() { resolve(token); })
                        .catch(reject);
                })
            }
        }
    });

    return User;
};

