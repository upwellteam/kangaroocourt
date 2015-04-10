var debug = require('debug')(require('../../package').name + ':models:dispute');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Dispute', {
        name: {
            type: DataTypes.STRING(128),
            allowNull : false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull : false
        },
        imgUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull : false
        },
        activeUntil: {
            type: DataTypes.DATE,
            allowNull : false
        },
        bet: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        }
    }, {
        setterMethods : {},
        classMethods : {
            associate : function(models) {
                models.Dispute.belongsTo(models.User, {as: 'defendant'});
                models.Dispute.belongsTo(models.User, {as: 'plaintiff'});
                models.Dispute.hasMany(models.Argument);
                models.Dispute.hasMany(models.Jury);
            }
        },
        instanceMethods: {}
    });
};

