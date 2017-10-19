/**
 * 地址级联
 * Created by xuwusheng on 16/1/27.
 */
define(['../app'], function (app) {
    app.factory('addressLinkage', ['$http', '$filter','$q', 'HOST', function ($http, $filter,$q, HOST) {
        function get(url,data){
            //将parm转换成json字符串
            data.param = $filter('json')(data.param);
            var deferred = $q.defer();
            $http.post(HOST + url, data)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (e) {
                    deferred.reject('error:' + e);
                });
            return deferred.promise;
        }
        return {
            //省
            getProvince: function (data) {
                return get('/areaInfo/getAreaInfoList',data);
            },
            //市
            getCity: function (data) {
                return get('/areaInfo/getListByParentId',data);
            },
            //区 县
            getCounty: function (data) {
                return get('/areaInfo/getListByParentId',data);

            },
            //物流部
            getFbWldept: function (data) {
                return get('/areaInfo/getWldeptfoList',data);

            }
        }
    }])
})