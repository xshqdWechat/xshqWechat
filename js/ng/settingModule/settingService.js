angular.module('setting.service', [])
    .filter('isSelect', function () {
        function isSelectFitter(inputObj, instedArr) {
            var selectArray = [],
                count = 0,
                repaetDayNum = 0;;
            for (var i in inputObj) {
                if (inputObj[i]) {
                    selectArray.push(instedArr[count]);
                    repaetDayNum++;
                }
                count++;
            }
            return repaetDayNum == 7 ? '每天' : selectArray.join(' ');
        };
        isSelectFitter.$stateful = true;
        return isSelectFitter
    })
    .service('shadow', function () {
        function shadow() {

        }

        function initShadow() {
            var wh, ww, shadowDiv;
            wh = angular.element().
            shadowDiv = angular.element('<div class="shaw"></div>');
        }

        shadow.prototype.showShadow = function () {

        };
        shadow.prototype.closeShadow = function () {

        };
        return shadow;
    })
    .factory('tmpcache', function () {
        var tmpScource;
        var cache = {};
            cache.getTmpSource = function(){
                return JSON.parse(tmpScource);
            };
            cache.setTmpSource = function(source){
                tmpScource = JSON.stringify(source);
            };
        return cache;
    })