var debug = require('debug')('kangaroo:models:intro');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Intro', {
        state: {
            type: DataTypes.BOOLEAN,
            allowNull : false
        }
    }, {
        setterMethods : {},
        classMethods : {
            associate : function(models) {
                models.Intro.belongsTo(models.User);
            }
        },
        instanceMethods: {}
    });
};


