var debug = require('debug')(require('../../package').name + ':models:jury');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Jury', {
        side : {
            type: DataTypes.ENUM('plaintiff', 'defendant'),
            allowNull : false
        },
        vote: DataTypes.ENUM('plaintiff', 'defendant')
    }, {
        setterMethods : {},
        classMethods : {
            associate : function(models) {
                models.Jury.belongsTo(models.Dispute);

                models.Jury.belongsTo(models.User);
                models.User.hasMany(models.Jury);

                models.Jury.belongsTo(models.Invitation, { as : 'Invite'});
            }
        },
        instanceMethods: {}
    });
};

