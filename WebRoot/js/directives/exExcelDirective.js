/**
 * Created by xuwusheng on 16/3/11.
 */
define(['../app', 'FileSaver'], function (app) {
    app.directive('pl4Excel', ['$rootScope', 'HOST', '$http', function ($rootScope, HOST, $http) {
        return {
            restrict: 'EA',
            scope: {
                action: '@',
                gridNull:'@',
                exParams: '=exParams',
                btnTitle: '@',
                alertTitle: '@',
                grid: '=?gridTable'
            },
            //template: "<button class='btn btn-primary btn-sm' ng-click='exClick($event)'>{{(btnTitle?btnTitle:'导出EXCEL')}}</button>",
            template: "<form style='display: inline-block;' method='post' action='{{actionParams}}' target='_bank'>" +
            "<input type='hidden' name='param' value='{{exParams}}' />" +
            "<button class='btn btn-primary btn-sm' ng-click='exClick($event)'>{{(btnTitle?btnTitle:'导出EXCEL')}}</button></form>",
            link: function ($scope, ele, attr) {
                $scope.exClick = function (e) {
                    if(!$scope.gridNull) {
                        if (!$scope.grid || $scope.grid.length == 0) {
                            e.preventDefault();
                           //王震注释
                            alert('没有任何数据!');
                            return false;
                        }
                    }
                    //如当前页面数据超出就须去ctrl里面赋值总条数total给grid
                    if($scope.grid.total){
                        if($scope.grid.total >=20000) {
                            if (!confirm('根据当前查询条件，导出的数据已经超过两万行，但是最多导出两万行，确认要导出吗？')) {
                                e.preventDefault();
                            }
                        }else {
                            if (!confirm((!$scope.alertTitle ? '确定导出吗?' : $scope.alertTitle))) {
                                e.preventDefault();
                            }
                        }
                    }else {
                        if (!confirm((!$scope.alertTitle ? '确定导出吗?' : $scope.alertTitle))) {
                            e.preventDefault();
                        }
                    }


                    /*if (confirm((!$scope.alertTitle ? '确定导出吗?' : $scope.alertTitle))) {
                     e.preventDefault();
                     $http({
                     url: HOST+$scope.action,
                     method: "POST",
                     data: {param:$scope.exParams},
                     responseType: 'arraybuffer'
                     }).success(function (data, status, headers, config) {
                     console.log(data)
                     saveAs(new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "test.xlsx");
                     }).error(function (data, status, headers, config) {
                     //upload failed
                     });
                     }*/
                }
                $scope.$watch('action', function () {
                    $scope.actionParams = HOST + $scope.action + '?tokenId=' + $rootScope.userInfo.token + '&sessionid=' + $rootScope.userInfo.sessionId;

                });
            }

        };
    }]);
});