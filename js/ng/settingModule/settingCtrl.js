angular.module('setting.controllers', [])
    .controller('settingHomeCtrl', ['$scope',function ($scope) {}])
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