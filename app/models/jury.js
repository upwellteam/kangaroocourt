var debug = require('debug')(require('../../package').name + ':models:jury');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Jury', {
        vote: {
            type: DataTypes.STRING,
            allowNull : false
        }
    }, {
        setterMethods : {},
        classMethods : {
            associate : function(models) {
                models.Jury.belongsTo(models.User, {as: 'User'});
                models.Jury.belongsTo(models.Dispute);
            }
        },
        instanceMethods: {}
    });
};

