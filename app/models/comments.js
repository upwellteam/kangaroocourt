var debug = require('debug')('kangaroo:models:comment');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Comment', {
        text: {
            type: DataTypes.TEXT,
            allowNull : false
        }
    }, {
        setterMethods : {},
        classMethods : {
            associate : function(models) {
                models.Comment.belongsTo(models.Dispute);
                models.Comment.belongsTo(models.User);
            }
        },
        instanceMethods: {}
    });
};


