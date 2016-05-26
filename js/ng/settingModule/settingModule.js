angular.module('setting', ['ui.router','setting.controllers','setting.directives'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
//            .state('settinghome', {
//                url: '/clock',
//                templateUrl: 'template/setting/clockList.html',
//                controller: 'clockCtrl'
//            })
            .state('clock', {
                url: '/clock',
                templateUrl: 'template/setting/clockList.html',
                controller: 'clockCtrl'
            })
            .state('settingClock', {
                url: '/settingClock',
                templateUrl: 'template/setting/clocksetting.html',
                controller: 'clockSettingCtrl'
            });

        $urlRouterProvider.otherwise('/clock');
    });