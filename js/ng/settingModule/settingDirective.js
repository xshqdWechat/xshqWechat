angular.module('setting.directives', [])
    .directive('switchBtn', function () {
        return {
            restrict: 'EA',
            template: ''
        }
    })

    /* 单选按钮指令
     dataFormat
     [
     {typeNameStr:'类型'
     typeName:'clockType',
     attribute:[{
     NameStr:'起床',
     value:'0',
     id:'wakeUp'
     },
     {
     NameStr:'吃药',
     value:'1',
     id:'medicine'
     }
     ]
     }]
     */
    /* htmlEg
     <div wx-radio source="dataFormat">
     {{clockType2.typeNameStr}}
     <div wx-radio-item ng-repeat="attr in clockType2.attr" index="{{$index}}">
     <label for='{{attr.id}}'><span>{{attr.NameStr}}<i ng-class={'checkd':dataFormat2.clockType==attr.value} class="wxRadio"></i></span>
     <input type="radio" name='{{clockType2.typeName}}' value="{{attr.value}}" id='{{attr.id}}' ng-model="dataFormat2.clockType">
     </label>
     </div>
     </div>

     @source:需要传输的数据源
     */
    .directive('wxRadio', [function () {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {source: '='},
            template: '<div class="myRadio" ng-transclude></div>',
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                this.selected = function (n) {
                    $scope.$apply(function () {
                        // DoSomeThing
                        console.log($scope.source);
                    });
                }
            }]
        }
    }])
    .directive('wxRadioItem', [function () {
        return {
            restrict: 'EA',
            scope: {index: '@'},
            replace: true,
            transclude: true,
            require: '^wxRadio',
            template: '<ng-transclude></ng-transclude>',
            link: function (scope, ele, attrs, wxRadioCtr) {
                ele.find('label').on('click', function (e) {
                    if (e.target.tagName != 'INPUT') {
                        return;
                    }
                    wxRadioCtr.selected(scope.index);
                })
            }
        }
    }])

    // 开关指令

    /*    <div switch-btn class="light-btn" ng-class={'off':!dataFormat.light} ng-click="dataFormat.light=!dataFormat.light">
     <div class="light-bg box-state">
     <span class="flex-1"></span>
     <span class="flex-1"></span>
     </div>
     <div class="swip-btn switch-btn"></div>
     </div>*/
    // @ng-click 操作的数据
    .directive('switchBtn', function () {
        return {
            restrict: 'EA',
            tamplate: '<div class="light-bg box-state"><span class="flex-1"></span><span class="flex-1"></span></div><div class="swip-btn switch-btn"></div>'
        }
    })

    // 多选指令
    .directive('wxCheckbox', [function () {
        return {
            restrict: 'EA',
            template: '<span>{{isSelect}}</span><ng-transclude></ng-transclude>',
            scope: {
                source: '=',
                insteadArr:'='
            },
            transclude:true,
            controller: ['$scope', '$filter', function ($scope, $filter) {
                $scope.isSelect = $filter('isSelect')($scope.source,$scope.insteadArr);
                this.selected = function () {
                    console.log($scope.source);
                    $scope.$apply(function () {
                        $scope.isSelect = $filter('isSelect')($scope.source,$scope.insteadArr);
                    })
                }
            }]
        }
    }])
    .directive('wxCheckboxItem',[function () {
        return {
            restrict:'EA',
            require:'^wxCheckbox',
            link:function (scope,ele,attrs,wxCheckboxCtr) {
                ele.find('label').on('click', function (e) {
                    if (e.target.tagName != 'INPUT') {
                        return;
                    }
                    wxCheckboxCtr.selected();
                });
            }
        }
    }])
    // 测试
    .directive('test', function () {
        return {
            restrict: 'EA',
            scope: {testr: '='},
            controller: ['$scope', function ($scope) {

            }],
            template: '123 {{testr}}',
            link: function (scope, ele, attrs) {
                ele.on('click', function () {
                    console.log(scope.testr);
                })
            }
        }
    })