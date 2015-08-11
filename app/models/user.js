var debug = require('debug')('kangaroo:models:user');

var uuid = require('uuid'),
    Promise = require('bluebird');

var app = require('../app'),
    config = app.get('config'),
    errors = require('../errors'),
    utils = require('../utils');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('User', {
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
        setterMethods : {},
        classMethods : {
            associate : function(models) {}
        },
        instanceMethods: {
            toJSON : function () {
                var result;

                result = utils.pick(this, 'id name email role gender createdAt updatedAt');

                return result;
            },
            generateToken : function() {
                console.log('generating token');
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
                    console.log(self, token);
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
};

