angular.module('setting.controllers', [])
    .controller('settingHomeCtrl', ['$scope', function ($scope) {
        // 数据列表
        $scope.deviceList = [
            {
                id: 'JDheartRate',
                name: '碧德心率手环'

            },
            {
                id: 'cammyWeightScale',
                name: '香山体重秤'
            },
            {
                id: 'cammyHeartRateScale',
                name: '香山心率秤'
            }
        ];
    }])
    .controller('deviceSettingCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {
        $scope.id = $stateParams.id;
        $scope.name = $stateParams.name;

        $scope.abc = 'abcdefg';

        $scope.dataFormat = {
            deviceName: 'A',
            id: 'A-a',
            light: true,
            lightDay:  {
                FF: 0,
                GG: 0,
                HH: 1,
                II: 0,
                JJ: 0,
                KK: 0,
				EE: 1
            },
            clockType: 0,
            clockType2: 1,
            tip:'备注'
        };

        $scope.dataFormat2 = {
            deviceName: 'B',
            id: 'A-a',
            light: true,
            lightDay: {
                EE: 1,
                FF: 0,
                GG: 0,
                HH: 1,
                II: 0,
                JJ: 0,
                KK: 0
            },
            clockType: 0
        };

        // 单选

        $scope.clockType = {
            typeNameStr: '类型',
            typeName: 'clockType',
            attr: [
                {
                    NameStr: '起床',
                    value: 0,
                    id: 'wakeUp',
                },
                {
                    NameStr: '吃药',
                    value: 1,
                    id: 'medicine',
                }
            ]
        };

        $scope.clockType2 = {
            typeNameStr: '类型',
            typeName: 'clockType2',
            attr: [
                {
                    NameStr: '起床',
                    value: 0,
                    id: 'wakeUp2',
                },
                {
                    NameStr: '吃药',
                    value: 1,
                    id: 'medicine2',
                }
            ]
        };

        // 开关数据
        $scope.switchData = {
            typeNameStr: '闹钟1',
            value: true
        };

        // 多选数据
        $scope.checkboxData = {
            typeNameStr: '重复',
            typeName: 'repeatday',
            attr: [
               
                {
                    nameStr: '周一',
                    value: 1,
                    id: 'FF'
                },
                {
                    nameStr: '周二',
                    value: 1,
                    id: 'GG'
                },
                {
                    nameStr: '周三',
                    value: 1,
                    id: 'HH'
                },
                {
                    nameStr: '周四',
                    value: 1,
                    id: 'II'
                },
                {
                    nameStr: '周五',
                    value: 1,
                    id: 'JJ'
                },
                {
                    nameStr: '周六',
                    value: 1,
                    id: 'KK'
                },
				 {
                    nameStr: '周日',
                    value: 1,
                    id: 'EE'
                }
            ]
        };
        
        $scope.tip = {
            typeNameStr:'备注',
            value:'初始值！'
        }
    }])
    .controller('clockSettingCtrl', ['$scope', function ($scope) {
    }])
