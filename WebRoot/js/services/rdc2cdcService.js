/**
 * Created by xuwusheng on 16/2/24.
 */
define(['./appService'], function (service) {
	var service = angular.module('app.service');
    service.factory('rdc2cdc', ['$http', '$q','$filter','HOST', function ($http,$q,$filter,HOST) {
        function get(data,url){
            //将parm转换成json字符串
            data.param=$filter('json')(data.param);
            var deferred=$q.defer();
            $http.post(HOST+url,data)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (e) {
                    deferred.reject('error:'+e);
                });

            return deferred.promise;
        }
        return {
            getRDC: function (data) {
               return get(data,'/CkBaseInfo/getRDCList');
            },
            getCDC: function (data) {
                return get(data,'/CkBaseInfo/getCRCByRDC');
            }
        }
    }]);
});