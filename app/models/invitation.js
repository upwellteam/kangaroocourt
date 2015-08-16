var debug = require('debug')('kangaroo:models:invitation');

var Promise = require('bluebird');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Invitation', {
        type : {
            type : DataTypes.ENUM('jury', 'defendant'),
            allowNull : false
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull : false
        },
        code: {
            type: DataTypes.STRING,
            allowNull : false,
            defaultValue : function (){ return JSON.stringify(Date.now()) }
        }
    }, {
        setterMethods : {},
        classMethods : {
            associate : function(models) {
                models.Invitation.belongsTo(models.Dispute);
            }
        },
        instanceMethods: {
            handle : function(user){
                var self = this,
                    models = require('../app').get('models');
                return models.Invitation
                    .findAll({
                        where : { email : self.email },
                        include : [
                            models.Dispute
                        ]
                    })
                    .then(function(invitations){
                        return Promise.map(invitations, function(invitation) {
                            switch (invitation.type) {
                                case 'defendant' :
                                    var dispute = invitation.Dispute;
                                    dispute.setDataValue('DefendantId', user.id);
                                    return dispute.save();
                                case 'jury' :
                                    return models.Jury
                                        .find({ where : { InviteId : invitation.id} })
                                        .then(function(jury){
                                            jury.setDataValue('UserId', user.id);
                                            jury.setDataValue('InviteId', null);
                                            return jury.save();
                                        });
                            }
                        })
                    })
                    .then(function(){
                        return models.Invitation.destroy({ where : { email : self.email }})
                    });
            }
        }
    });
};