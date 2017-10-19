/**
 * Created by xuwusheng on 16/1/5.
 */
'use strict';
define(['../app'], function (app) {
    app.directive('pl4StorageSelect', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            template: '<div class="form-inline">' +
            '<div class="form-group has-feedback">' +
            '<label>{{labelName}}：</label>' +
            '<div class="dropdown"><input ng-model="$storageSelectedRDCVal" ng-focus="$storageSelectedToggUl()" ng-keyup="$storageSelectedRDCKeyup()" ng-blur="$storageSelectedRDCBlur()" class="form-control text-select" id="rdcDropdownMenu" aria-haspopup="true" aria-expanded="false" type="text"><span class="glyphicon glyphicon-triangle-bottom form-control-feedback"></span>' +
            '<ul class="dropdown-menu dropdown-menu-select" aria-labelledby="rdcDropdownMenu" ng-hide="isHide">' +
            '<li ng-repeat="item in storageRDC"><a href="javascript:;" ng-click="$storageSelectedRDCOptionClick(item.id,item.name)">{{item.name}}</a></li>' +
            '</ul></div>' +
            /*'<select class="form-control" ng-model="storageSelectedRDC" ng-options="v.id as v.name for v in storageRDC" ng-change="storageSelectedFirstValue(storageSelectedRDC)">' +
            '</select>' +*/
            '</div>&nbsp;&nbsp;&nbsp;' +
            '<div class="form-group has-feedback" ng-if="storageCDCVi.length>0">' +
            '<div class="dropdown"><input ng-model="$storage.$storageSelectedCDCVal" ng-keyup="$storageSelectedCDCKeyup($storageSelectedCDCVal)" ng-blur="$storageSelectedCDCBlur()" class="form-control text-select" id="rdcDropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" type="text"><span class="glyphicon glyphicon-triangle-bottom form-control-feedback"></span>' +
            '<ul class="dropdown-menu" aria-labelledby="rdcDropdownMenu">' +
            '<li ng-repeat="item in storageCDCVi"><a href="javascript:;" ng-click="$storageSelectedCDCOptionClick(item.id,item.name)">{{item.name}}</a></li>' +
            '</ul></div>' +
            //'<select class="form-control" ng-model="storageSelectedCDC" ng-change="storageSelectedCDCChange(storageSelectedCDC)" ng-options="v.id as v.name for v in storageCDCVi">' +
            '</select></div></div>',
            link: function ($scope, el, attr) {
                $scope.isHide = true;
                $scope.$storage = {};
                $scope.labelName = '仓库选择';
                $scope.storageSelectedRDC = '-1';
                $scope.storageSelectedCDC = '-1';
                $scope.$storageSelectedRDCVal = '全部';
                $scope.$storage.$storageSelectedCDCVal = '全部';
                $scope.$storage.$storageSelectedCDC = '-1';
                //清空输入框的值
                $scope.$storageSelectedToggUl = function () {
                    $scope.isHide = false;
                }
                if ($scope.storageCDC) {
                    $scope.storageCDCVi = $scope.storageCDC;
                } else {
                    //$scope.storageCDCVi = [{id: '-1', name: '全部'}];
                }
                //RDC下拉框li click事件
                $scope.$storageSelectedRDCOptionClick = function (id, name) {
                    $scope.storageSelectedRDC = id;
                    $scope.$storageSelectedRDCVal = name;
                    $scope.$storage.$storageSelectedCDCVal = '全部';
                    $scope.storageSelectedFirstValue(id);
                    $scope.storageRDC = storageRDCTemp;
                    $scope.isHide = true;
                }

                var storageRDCTemp, storageCDCTemp, storageRDCKeyTimer, storageCDCKeyTimer;
                var watch = $scope.$watch('storageRDC', function () {
                    if (!$scope.storageRDC) return false;

                    storageRDCTemp = angular.copy($scope.storageRDC);

                    watch();

                });
                $scope.$storageSelectedRDCBlur = function () {
                    $timeout(function () {
                        if ($scope.storageSelectedRDC == '-1') {
                            $scope.$storageSelectedRDCVal = '全部';
                        }
                        $scope.storageRDC = storageRDCTemp;
                        $scope.storageSelectedFirstValue($scope.storageSelectedRDC);
                        $scope.isHide = true;
                    }, 300);

                }
                $scope.$storageSelectedCDCBlur = function () {
                    $timeout(function () {
                        if ($scope.storageSelectedCDC.toString() == '-1') {
                            $scope.$storage.$storageSelectedCDCVal = '全部';
                        }
                        $scope.storageCDCVi = storageCDCTemp;
                    }, 300);

                }
                //RDC输入框keyup 事件
                $scope.$storageSelectedRDCKeyup = function () {
                    if (storageRDCKeyTimer) $timeout.cancel(storageRDCKeyTimer);

                    var tempArr = $scope.storageRDC;

                    storageRDCKeyTimer = $timeout(function () {
                        $scope.storageSelectedRDC = '-1';
                        var drcTemp = [];
                        if ($scope.$storageSelectedRDCVal == '') {
                            $scope.storageRDC = storageRDCTemp;
                        } else if ($scope.$storageSelectedRDCVal != '全部') {
                            var val = $scope.$storageSelectedRDCVal.toLowerCase();
                            angular.forEach(storageRDCTemp, function (item) {
                                var name = item.name.toLowerCase();
                                if (name.indexOf(val) >= 0) {
                                    drcTemp.push(item);
                                    if (name == val) {
                                        $scope.storageSelectedRDC = item.id;
                                    }
                                }

                            })
                            $scope.storageRDC = drcTemp;
                        }
                    }, 300);

                }
                //CDC输入框keyup 事件
                $scope.$storageSelectedCDCKeyup = function () {
                    if (storageCDCKeyTimer) $timeout.cancel(storageCDCKeyTimer);
                    storageCDCKeyTimer = $timeout(function () {
                        $scope.storageSelectedCDC = '-1';
                        var cdcTemp = [];

                        if ($scope.$storage.$storageSelectedCDCVal == '') {

                            $scope.storageCDCVi = storageCDCTemp;
                        } else if ($scope.$storage.$storageSelectedCDCVal != '全部') {


                            var val = $scope.$storage.$storageSelectedCDCVal.toLowerCase();
                            angular.forEach($scope.storageCDCVi, function (item) {
                                var name = item.name.toLowerCase();
                                if (name.indexOf(val) >= 0) {
                                    cdcTemp.push(item);
                                    if (name == val) {
                                        $scope.storageSelectedCDC = item.id;
                                    }
                                }
                            })
                            $scope.storageCDCVi = cdcTemp.length > 0 ? cdcTemp : storageCDCTemp;
                        }
                    }, 300);

                }
                //CDC下拉框li click事件
                $scope.$storageSelectedCDCOptionClick = function (id, name) {
                    $scope.storageSelectedCDC = id;
                    $scope.storageSelectedCDC = id;
                    $scope.$storage.$storageSelectedCDCVal = name;
                }
                $scope.storageSelectedFirstValue = function (storageSelectedRDC) {
                    if (storageSelectedRDC.toString() == '-1') {
                        $scope.storageSelectedCDC = '-1';
                        $scope.storageCDCVi = [];
                        storageCDCTemp = [];
                        return false;
                    }
                    //初始化
                    $scope.storageCDCVi = [{ id: '-1', name: '全部' }];
                    angular.forEach($scope.storageCDC, function (item) {
                        if ($scope.storageSelectedRDC == item.parentId) {
                            $scope.storageCDCVi.push(item);
                        }
                    });
                    $scope.storageSelectedCDC = '-1';
                    storageCDCTemp = angular.copy($scope.storageCDCVi);
                    return false;
                }
                $scope.storageSelectedCDCChange = function (storageSelectedCDC) {
                    $scope.storageSelectedCDC = storageSelectedCDC;
                }
            }
        }
    }]);
})
    ;