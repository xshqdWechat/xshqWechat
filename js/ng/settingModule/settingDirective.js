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
            scope: {
                source: '='
            },
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
            scope: {
                index: '@'
            },
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

//@instead-arr 为需要呈现的文本 需跟数据顺序11对应
//HTML
//    <li>
//        <div wx-checkbox class="wxCheckboxtap" type-name={{checkboxData.typeNameStr}} source="dataFormat.lightDay" instead-arr="['周一','周二','周三','周四','周五','周六','周日']">
//            <!--   重复弹出-->
//            <div popup-div class="repeatDay">
//                <h6>{{checkboxData.typeNameStr}}</h6>
//                <ul class="myCheckbox">
//                    <li wx-checkbox-item class='clearfix' ng-repeat="checkbox in checkboxData.attr">
//                        <label for="{{checkbox.id}}"><span ng-bind="checkbox.nameStr"></span>
//                            <i class="wxCheckbox fr mt8" ng-class={'checkd':checkbox.value==dataFormat.lightDay[checkbox.id]}></i>
//                            <input type="checkbox" name="{{checkboxData.typeName}}" id='{{checkbox.id}}' ng-true-value="{{checkbox.value}}" ng-false-value='0' ng-checked="dataFormat.lightDay[checkbox.id]" ng-model="dataFormat.lightDay[checkbox.id]">
//                        </label>
//                    </li>
//                    <li class="twobtn">
//                        <cancle></cancle><ok></ok>
//                    </li>
//                </ul>
//            </div>
//        </div>
//    </li>
//数据格式
//$scope.checkboxData = {
//            typeNameStr: '重复',
//            typeName: 'repeatday',
//            attr: [
//               
//                {
//                    nameStr: '周一',
//                    value: 1,
//                    id: 'FF'
//                },
//                {
//                    nameStr: '周二',
//                    value: 1,
//                    id: 'GG'
//                },
//                {
//                    nameStr: '周三',
//                    value: 1,
//                    id: 'HH'
//                },
//                {
//                    nameStr: '周四',
//                    value: 1,
//                    id: 'II'
//                },
//                {
//                    nameStr: '周五',
//                    value: 1,
//                    id: 'JJ'
//                },
//                {
//                    nameStr: '周六',
//                    value: 1,
//                    id: 'KK'
//                },
//				 {
//                    nameStr: '周日',
//                    value: 1,
//                    id: 'EE'
//                }
//            ]
//        };
.directive('wxCheckbox', [function () {
        return {
            restrict: 'EA',
            template: '{{typeName}}<span>{{text}}</span><ng-transclude></ng-transclude><div shadow></div>',
            scope: {
                typeName: '@',
                source: '=',
                insteadArr: '='
            },
            transclude: true,
            link: function (scope, ele, attr) {
                ele.on('click', function () {
                    scope.$broadcast('open', true)
                })
            },
            controller: ['$scope', '$filter', '$transclude', function ($scope, $filter, $transclude) {
                $scope.open = false;
                $scope.text = $filter('isSelect')($scope.source, $scope.insteadArr);
                $scope.$on('close', function (event, data) {
                    if (data) {
                        $scope.$broadcast('open', false);
                    }
                })
            }]
        }
    }])
    .directive('wxCheckboxItem', [function () {
        return {
            restrict: 'EA',
            require: '^popupDiv',
            link: function (scope, ele, attrs, popupDivCtr) {
                ele.find('label').on('click', function (e) {
                    if (e.target.tagName != 'INPUT') {
                        return;
                    }
                    popupDivCtr.selected();
                });
            }
        }
    }])
//遮罩层
    .directive('shadow', ['$window', '$document', function ($window, $document) {
        return {
            restrict: 'EA',
            replace: true,
            template: '<div class="shaw"></div>',
            link: function (scope, ele, attrs) {

                // 创建遮罩层
                var shadowCss = {};

                // 返回宽高
                function getWH(name) {
                    var WH = {
                        wh: $document[0].body.offsetHeight,
                        ww: window.screen.width,
                        sh: $document[0].body.scrollHeight,
                        st: $document[0].body.scrollTop
                    }

                    return WH[name] + 'px';
                }
                shadowCss.width = getWH('ww');
                shadowCss.height = getWH('wh');
                shadowCss.top = 0;
                shadowCss.position = 'absolute';
                shadowCss.backgroundColor = '#000';
                shadowCss.opacity = .7;
                shadowCss.zIndex = 1200;
                ele.css(shadowCss);
                ele.remove();

                // 添加遮罩层，同时隐藏下拉条

                scope.$on('open', function (event, data) {
                    if (data) {
                        ele.css('top', getWH('st'));
                        angular.element($document[0].body).append(ele).css('overflow', 'hidden');
                        ele.on('click', function () {
                            scope.$emit('close', true);
                        })
                    } else {
                        ele.remove();
                        angular.element($document[0].body).css('overflow', 'auto');
                    }
                })

            }
        }
    }])
//弹出层
    .directive('popupDiv', ['tmpcache', function (tmpcache) {
        return {
            restrict: 'EA',
            link: function (scope, ele, attr) {

                //                设置弹出层默认样式
                ele.css({
                    'z-index': 1201,
                    'position': 'absolute',
                    'display': 'none',
                    'left': 0,
                    'top': 0,
                    'transtion': 'top ease-in-tou .16s'
                });
                //                抽出弹出层，并插入到BODY底部
                angular.element(document.querySelector('body')).append(ele);
                scope.$on('open', function (event, data) {
                    if (data) {
                        tmpcache.setTmpSource(scope.$parent.source);
                        ele.css('display', 'block');
                    } else {
                        ele.css('display', 'none');
                    }
                })

            },
            controller: ['$scope', '$filter', 'tmpcache', function ($scope, $filter, tmpcache) {

                this.selected = function () {
                    $scope.$apply(function () {
                        $scope.$parent.text = $filter('isSelect')($scope.$parent.source, $scope.$parent.insteadArr);
                    })
                };
                this.ok = function () {
                    $scope.$emit('close', true);
                };
                this.cancle = function () {
                    $scope.$apply(function () {
                        $scope.$parent.source = tmpcache.getTmpSource();
                        $scope.$parent.text = $filter('isSelect')($scope.$parent.source, $scope.$parent.insteadArr);
                    })
                    $scope.$emit('close', true);
                };
			}]
        }
    }])
//弹出层按钮
    .directive('cancle', [function () {
        return {
            restrict: 'EA',
            require: '^popupDiv',
            replace: true,
            template: '<a href="javascript:;" class="btnCancal">取消</a>',
            link: function ($scope, $ele, $attr, popupDivCtr) {
                $ele.on('click', function () {
                    popupDivCtr.cancle();
                })
            }
        }
    }])
    .directive('ok', [function () {
        return {
            restrict: 'EA',
            require: '^popupDiv',
            replace: true,
            template: '<a href="javascript:;" class="btnOK">确定</a>',
            link: function ($scope, $ele, $attr, popupDivCtr) {
                $ele.on('click', function () {
                    popupDivCtr.ok();
                })
            }
        }
    }])
    .directive('wxTip',[function(){
        return {
            restrict: 'EA',
            template:'{{typeName}}<span>{{text}}</span><ng-transclude></ng-transclude><div shadow></div>',
            transclude:true,
            scope:{
                typeName:'@'
            },
            link:function(scope,ele,attr){
//                ele.on('click', function () {
//                    ele.$broadcast('open', true)
//                })
            },
            controller:['$scope',function($scope){
//                $scope.text = ;
            }]
            
        }
    }])
    // 测试
    .directive('test', function () {
        return {
            restrict: 'EA',
            scope: {
                testr: '='
            },
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