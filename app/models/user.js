var debug = require('debug')(require('../../package').name + ':models:user');

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
        instanceMethods: {}
    });
};

