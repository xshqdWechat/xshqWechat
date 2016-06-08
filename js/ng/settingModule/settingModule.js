angular.module('setting', ['ui.router','setting.controllers','setting.directives','setting.service'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('settingHome', {
                url: '/settingHome',
                templateUrl: 'template/setting/settingHome.html',
                controller: 'settingHomeCtrl'
            })
            .state('deviceSetting',{
                url:'/deviceSetting',
                params:{
                    id:null,
                    name:null
                },
                templateUrl:'template/setting/deviceSetting.html',
                controller:'deviceSettingCtrl'
            })
//            .state('clock', {
//                url: '/clock',
//                templateUrl: 'template/setting/clockList.html',
//                controller: 'clockCtrl'
//            })
//            .state('settingClock', {
//                url: '/settingClock',
//                templateUrl: 'template/setting/clocksetting.html',
//                controller: 'clockSettingCtrl'
//            });

        $urlRouterProvider.otherwise('/settingHome');
    });