var debug = require('debug')('kangaroo:models:refreshToken');

var app = require('../app.js');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    var RefreshToken = sequelize.define('RefreshToken', {
        access : {
            type: DataTypes.STRING(36),
            allowNull : false,
            validate : { len: [36] }
        },
        refresh : {
            type: DataTypes.STRING(36),
            allowNull : false,
            validate : { len: [36] }
        }
    }, {
        updatedAt : false,
        classMethods : {
            associate : function(models) {
                models.RefreshToken.belongsTo(models.User);
            }
        },
        instanceMethods: {
            regenerate : function() {
                var redis = app.get('redis'),
                    self = this,
                    user;

                return self
                    .getUser()
                    .then(function(entity) {
                        user = entity;
                        return redis.del(self.access);
                    })
                    .then(function() {
                        return self.destroy();
                    })
                    .then(function() {
                        return user.generateToken()
                    })
            }
        }
    });

    return RefreshToken;
};

