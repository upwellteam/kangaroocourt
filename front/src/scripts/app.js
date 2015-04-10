$(document).ready(function() {

    var Kangaroo = {};

    /*DEV*/ document.Kangaroo = Kangaroo; /* ENDDEV */

    var TEMPLATES = {
        navbarLeft : $('script#navbar-left').html(),
        navbarRight : $('script#navbar-right').html(),
        front : $('script#template-front').html(),
        disputeOne : $('script#template-dispute-one').html()
    };

    Object.keys(TEMPLATES).forEach(function(name){
        TEMPLATES[name] = _.template(TEMPLATES[name]);
    });

    Kangaroo.router = new (Backbone.Router.extend({
        routes: {
            "": "front",
            "disputes?type=:type": "disputesList",
            "disputes": "disputesList",
            "disputes/:id": "disputesOne",
            "user/:id" : "userDispute",
            "oauth/:provider?code=:code" : "oauth",
            "logout" : "logout"
        },

        front: FrontController,
        disputesList: DisputesListController,
        disputesOne: DisputesOneController,
        userDispute: userDisputeController,
        oauth : oAuthController,
        logout : logoutController
    }));

    Kangaroo.router.on('route', UpdateMenu);

    Backbone.history.start({ pushState: true });


    //
    // controllers
    //
    function FrontController() {
        var self = this;
        $.getJSON('/api/disputes', function(data) {
            $('#navbar-left').html(TEMPLATES.navbarLeft(getLocals({ disputes : data })));
            $('#navbar-right').html(TEMPLATES.navbarRight(getLocals({ disputes : data })));
            $('#content').html(TEMPLATES.front(getLocals({ disputes : data })));
            self.trigger('routeReady');
        });
    }

    function DisputesListController(type) {
        var self = this;
        $.getJSON('/api/disputes/' + (type !== null ? '?type='+type : ''), function(data) {
            $('#navbar-left').html(TEMPLATES.navbarLeft(getLocals({ disputes : data })));
            $('#navbar-right').html(TEMPLATES.navbarRight(getLocals({ disputes : data })));
            $('#content').html(TEMPLATES.front(getLocals({ disputes : data })));
            self.trigger('routeReady');
        });
    }

    function DisputesOneController(id) {
        var self = this;
        $.getJSON('/api/disputes/'+id, function(data) {
            localStorage.setItem('dispute', JSON.stringify(data));
            $('#navbar-left').html(TEMPLATES.navbarLeft(getLocals({ disputes : data })));
            $('#navbar-right').html(TEMPLATES.navbarRight(getLocals({ disputes : data })));
            $('#content').html(TEMPLATES.disputeOne(getLocals({ disputes : data })));

            switchArgument();
            votes();
            self.trigger('routeReady');

        })
    }

    function userDisputeController(id){
        var self = this;
        $.getJSON('/api/user/'+id, function(data) {
            $('#navbar-left').html(TEMPLATES.navbarLeft(getLocals({ disputes : data })));
            $('#navbar-right').html(TEMPLATES.navbarRight(getLocals({ disputes : data })));
            $('#content').html(TEMPLATES.disputeOne(getLocals({ disputes : data })));
            self.trigger('routeReady');
        })
    }

    function oAuthController(provider, code) {
        if (provider !== 'facebook') { return null; }

        $.getJSON('/api/oauth/facebook?code='+code, function(data){
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            $.cookie('token', data.token, { expires: 7, path: '/' });

            Kangaroo.router.navigate('/', { trigger : true });
        }).fail(function(err){
            console.log(err)
        });
    }

    function logoutController() {
        var token = localStorage.getItem('token');
        $.get('/api/logout?token='+token, function(){
            Kangaroo.router.navigate('/', { trigger : true });
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');

    }


    //
    // functions
    //
    function UpdateMenu(route, params) {
        Kangaroo.router.once('routeReady', function(){
            $.material.init();
            if (!params[0]) {
                $('#all').addClass('active');
            }
            $('#'+params[0]).addClass('active');

            betCount(10);
        });
    }

    function getLocals(locals) {
        return $.extend({}, {
            user : JSON.parse(localStorage.getItem('user'))
        }, locals);
    }
});

