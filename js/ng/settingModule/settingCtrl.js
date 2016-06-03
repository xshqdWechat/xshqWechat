angular.module('setting.controllers', [])
    .controller('settingHomeCtrl', ['$scope',function ($scope) {
        // 数据列表
        $scope.deviceList = [
            {
                id:'JDheartRate',
                name:'碧德心率手环'

            },
            {
                id:'cammyWeightScale',
                name:'香山体重秤'
            },
            {
                id:'cammyHeartRateScale',
                name:'香山心率秤'
            }
        ];
    }])
    .controller('deviceSettingCtrl',['$scope','$stateParams',function ($scope,$stateParams) {
        $scope.id = $stateParams.id;
        $scope.name = $stateParams.name;
    }])
    .controller('clockCtrl',['$scope', function ($scope) {
        $(function () {
            //		开关灯
            $('.light-btn').each(function (i, e) {
                $(this).on('click', function () {
                    $(this).toggleClass('off');
                    if ($(this).hasClass('off')) {
                        console.log('关闭第' + i + '个闹钟!');
                    } else {
                        console.log('打开第' + i + '个闹钟!');
                    }
                })
            })
        })

    }])
    .controller('clockSettingCtrl', ['$scope',function ($scope) {}])
