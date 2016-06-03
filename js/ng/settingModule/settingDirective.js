angular.module('setting.directives',[])
.directive('switchBtn',function(){
    return {
        restrict: 'EA',
        template:''
    }
})
.directive('wxRadio',[function () {
    return {
        restrict: 'EA',
        scope:{},
        transclude:'element',
        replace:true,
        template:'<span ng-transclude></span>'
    }
}])