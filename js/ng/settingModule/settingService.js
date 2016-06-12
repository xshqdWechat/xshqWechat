angular.module('setting.service', [])
    .filter('isSelect', function () {
        function isSelectFitter(inputObj, instedArr) {
            var selectArray = [], count = 0;
            for (var i in inputObj) {
                if (inputObj[i]) {
                    selectArray.push(instedArr[count]);
                }
                count++;
            }
            return selectArray.join(' ');
        };
        isSelectFitter.$stateful = true;
        return isSelectFitter
    })
    .service('shadow', function () {
        function shadow() {

        }
        function initShadow() {
            var wh,ww,shadowDiv;
            wh = angular.element().
            shadowDiv = angular.element('<div class="shaw"></div>');
        }

        shadow.prototype.showShadow = function () {

        };
        shadow.prototype.closeShadow = function () {
            
        };
        return shadow;
    })