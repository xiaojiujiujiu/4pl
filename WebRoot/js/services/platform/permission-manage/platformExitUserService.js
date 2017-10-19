/**
 * Created by xiaojiu on 2017/2/9.
 */
define(['../../../app'], function (app) {
    app.factory('platformExitUser', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+(!url?'/expel/exitUser':url),data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            }
        }
    }]);
});