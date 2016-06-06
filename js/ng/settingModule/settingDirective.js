angular.module('setting.directives', [])
    .directive('switchBtn', function () {
        return {
            restrict: 'EA',
            template: ''
        }
    })
    .directive('wxRadio', [function () {
        /*    dataFormat
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
         类型
         <label for='wakeUp'><span>起床<i class="wxRadio checkd"></i></span>
         <input type="radio" name='clockType' value="0" id='wakeUp'>
         </label>
         <label for='medicine'><span>吃药<i class="wxRadio"></i></span>
         <input type="radio" name='clockType' value="1" id='medicine'>
         </label>
         </div>
         */
        return {
            restrict: 'EA',
            scope: {},
            transclude: true,
            replace: true,
            template: '<div class="myRadio" ng-transclude></div>',
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            }]

        }
    }])
    .directive('wxRadioItem', [function () {
        return {
            restrict: 'EA',
            require: '',
            replace: true,
            transclude: true,
            require: '^wxRadio',
            template: '<ng-transclude></ng-transclude>',
            link: function (scope, ele, attrs) {
                ele.find('label').on('click',function (e) {
                    if(e.target.tagName != 'INPUT'){
                        return;
                    }
                    console.log(e.target.tagName);
                })
            }
        }
    }])