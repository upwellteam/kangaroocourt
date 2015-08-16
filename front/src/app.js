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
    .constant('CONFIG', CONFIG)
    .constant('MAX_EVIDENCE', 3)
    .constant('DISPUTE_CATEGORIES', [
        'love', 'animals', 'kids', 'money', 'work', 'health', 'intimacy', 'miscellaneous'
    ]);