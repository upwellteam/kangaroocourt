var debug = require('debug')(require('../../package').name + ':models:argument');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Argument', {
        role: {
            type: DataTypes.STRING(128),
            allowNull : false
        },
        argument: {
            type: DataTypes.TEXT,
            allowNull : false
        }
    }, {
        setterMethods : {},
        classMethods : {
            associate : function(models) {
                models.Argument.belongsTo(models.Dispute);
                models.Argument.belongsTo(models.User, {as: 'User'});
            }
        },
        instanceMethods: {}
    });
};


