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
     {typeNameStr:'类型',
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
     <div wx-radio>
     {{clockType.typeNameStr}}
     <div wx-radio-item ng-repeat="attr in clockType.attr" index="{{$index}}">
     <label for='{{attr.id}}'><span>{{attr.NameStr}}<i ng-class={'checkd':attr.checked} class="wxRadio"></i></span>
     <input type="radio" name='{{clockType.typeName}}' value="{{attr.value}}" id='{{attr.id}}'>
     </label>
     </div>
     </div>
     */
    .directive('wxRadio', [function () {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope:{source:'='},
            template: '<div class="myRadio" ng-transclude></div>',
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                this.selected = function (n){
                    $scope.$apply(function () {
                        for (var i = 0, len = $scope.source.attr.length; i < len; i++) {
                            i != n ? $scope.source.attr[i].checked = false : $scope.source.attr[i].checked = true;
                        }
                        console.log($scope.dataFormat);
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
    .directive('switchBtn',function () {
        return {
            restrict:'EA',
            link:function (scope,ele,attrs) {
            }
        }
    })

    .directive('test',function () {
        return {
            restrict:'EA',
            scope:{testr:'='},
            controller:['$scope',function ($scope) {

            }],
            template:'123 {{testr}}',
            link:function (scope,ele,attrs) {
                ele.on('click',function () {
                    console.log(scope.testr);
                })
            }
        }
    })