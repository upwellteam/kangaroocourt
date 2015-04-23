var debug = require('debug')('kangaroo:models:UserInvitation');

var Promise = require('bluebird');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('UserInvitation', {
        email: {
            type: DataTypes.STRING(128),
            allowNull : false
        },
        code: {
            type: DataTypes.TEXT,
            allowNull : false,
            defaultValue : function (){ return Date.now() }
        }
    }, {
        setterMethods : {},
        classMethods : {},
        instanceMethods: {
            handle : function(user){
                var self = this,
                    models = require('../app').get('models');

                models.Dispute
                    .findAll({ where : { defendantEmail : self.email} })
                    .then(function(disputes){
                        return Promise.map(disputes, function(dispute){
                            dispute.DefendantId = user.id;
                            disputes.defendantEmail = user.email;
                            return dispute.save();
                        });
                    })
                    .then(function(){
                        return models.UserInvitation.destroy({ where : { email : self.email }})
                    })
            }
        }
    });
};