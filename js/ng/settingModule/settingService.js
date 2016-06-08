angular.module('setting.service', [])
    .filter('isSelect', function () {
        function isSelectFitter(inputObj, instedArr) {
            var selectArray = [],count=0;
            for (var i in inputObj) {
                if (inputObj[i]){
                    selectArray.push(instedArr[count]);
                }
                count++;
            }
            return selectArray.join(' ');
        };
        isSelectFitter.$stateful = true;
        return isSelectFitter
    })
.factory('shadow',function () {
    
})