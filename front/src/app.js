angular
    .module('kangaroocourt', [
        'kangaroo.common',
        'kangaroo.base',
        'kangaroo.auth',
        'kangaroo.menu',

        'kangaroo.disputes',
        'kangaroo.profile',

        'ui.bootstrap',
        'relativeDate',
        'ngAnimate'
    ])
    .constant('OAUTH_PROVIDERS', {
        facebook : {
            client_id : '1430810303881868',
            redirect_uri : 'http://kangaroocourt.loc:3000/oauth/facebook'

            //client_id : '1620271311542333',
            //redirect_uri : 'http://kangaroocourt.herokuapp.com/oauth/facebook'
        }
    })
    .constant('DISPUTE_CATEGORIES', [
        'love', 'animals', 'kids', 'money', 'work', 'health', 'intimacy', 'miscellaneous'
    ]);