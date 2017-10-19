/**
 * Created by xuwusheng on 16/3/8.
 */

'use strict';
define(['../app'], function (app) {
    app.directive('pl4Verify', [function () {
        return {
            restrict: 'A',
            require: "ngModel",
            link: function ($scope, el, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    var verify = attrs.pl4Verify;
                    /*
                     if(smVerify=='required'){
                     ngModel.$setValidity('required', value === '');
                     }
                     else  */
                    if (verify == 'eq') {
                        var same = scope.$eval(attrs.sameAs);
                        ngModel.$setValidity('isEq', value === same);
                    } else if (verify == 'phone') {
                        var reg = /^0{0,1}(13[0-9]|15[0-9]|18[0-9]|17[0-9])[0-9]{8}$/,
                            test = reg.test(value);
                        ngModel.$setValidity('phone', test);
                    } else if (verify == 'number') {

                    }
                    return value;
                });

            }
        }
    }]);
    app.directive('pl4DataType', [function () {
        return {
            restrict: 'A',
            require: "?ngModel",
            link: function ($scope, el, attrs, ngModel) {
                var type = attrs.pl4DataType;
                el.on('keyup', function () {
                    var value = ngModel.$modelValue.toString();
                    switch (type) {
                        case 'number':
                            var reg = /[^0-9]/g,
                                reVal = value.replace(reg, '');
                            ngModel.$setViewValue(reVal);
                            this.value = reVal;
                            break;
                        case 'notUnicode':
                            var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/g,
                                reVal = value.replace(reg, '');
                            ngModel.$setViewValue(reVal);
                            this.value = reVal;
                            break;
                        case 'sku':
                            var reg = /[^A-Za-z0-9]/g,
                                reVal = value.replace(reg, '');
                            ngModel.$setViewValue(reVal);
                            this.value = reVal;
                            break;
                        case 'float':
                            var reg=/[^0-9\.]/g,
                                reVal = value.replace(reg, '');
                            if(reVal.split('.').length>2){
                                reVal=reVal.substr(0,reVal.length-1);
                            }
                            ngModel.$setViewValue(reVal);
                            this.value = reVal;
                            break;
                    }
                })
            }
        }
    }]);
});