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
        category: {
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
        },
        isPrivate: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        defendantEmail : DataTypes.STRING(128)
    }, {
        setterMethods : {},
        classMethods : {
            associate : function(models) {
                models.Dispute.belongsTo(models.User, {as: 'Defendant'});
                models.Dispute.belongsTo(models.User, {as: 'Plaintiff'});
                models.Dispute.hasMany(models.Argument);
                models.Dispute.hasMany(models.Jury);
            }
        },
        instanceMethods: {}
    });
};

