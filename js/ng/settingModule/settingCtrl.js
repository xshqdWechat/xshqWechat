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

        $scope.dataFormat = {
            deviceName:'A',
            id:'A-a',
            light:true,
            lightDay:{
                aa:1,
                bb:0,
                cc:1,
                dd:1,
                ee:0
            },
            clockType:1,
            clockType2:1
        };

        $scope.dataFormat2 = {
            deviceName:'B',
            id:'A-a',
            light:true,
            lightDay:{
                aa:1,
                bb:0,
                cc:1,
                dd:1,
                ee:0
            },
            clockType:0
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
            typeName: 'clockType',
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

        $scope.test = {name:'hahah'};
        // 开关数据
        $scope.switchData = {
                typeNameStr: '闹钟1',
                value: true
            };
        
        $scope.switch = function () {
            
        }
    }])
    .controller('clockSettingCtrl', ['$scope', function ($scope) {
    }])
