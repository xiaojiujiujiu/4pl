/**
 * Created by xuwusheng on 16/2/23.
 */
define(['../app'], function (app) {
    app.directive('addressLinkage', [function () {

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                result: '=addressModel',
                disabled: '=disabled'
            },
            template: '<div style="display: inline-block;"><select ng-if="result.province" class="form-control" style="width: 100px" ng-model="result.provinceSelected"' +
            'ng-options="o.id as o.name for o in result.province"' +
            'ng-change="result.provinceChange()"></select>' +
            '<select ng-if="result.city" class="form-control" ng-model="result.citySelected" style="width: 100px;margin:0 10px;"' +
            'ng-options="o.id as o.name for o in result.city"' +
            'ng-change="result.cityChange()"></select>' +
            '<select ng-if="result.county" ng-show="countyShow" class="form-control" ng-model="result.countySelected" style="width: 100px"' +
            'ng-options="o.id as o.name for o in result.county"></select></div>',
            link: function ($scope) {
                $scope.countyShow=true;
                //if(result.countySelected<=1){
                //    $scope.countyShow=false;
                //}
            }
        };
    }])
})