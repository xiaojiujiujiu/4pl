/**
 * Created by xuwusheng on 16/1/26.
 */
define(['../app'], function (app) {
    app.factory('login', ['$rootScope','$http','$filter','$q','$cookies','HOST','USERKOOKIE',function ($rootScope,$http,$filter,$q,$cookies,HOST,USERKOOKIE) {
        return {
            //登入
            signIn: function (data) {
                //将parm转换成json字符串
                return this.postData(data,'/j_spring_security_check');
            },
            //写入cookie信息
            putCookie: function (data) {
                var cookieInfo={
                    userId:data.userId,
                    userName:data.userName,
                    token:data.token,
                    account:data.account,
                    sessionId:data.sessionid,
                    userMsg:data.userMsg,
                    name:data.name,
                    roleName:data.roleName,
                    lastLoginTime:data.lastLoginTime,
                    barricade:data.barricade
                };
                $rootScope.userInfo=cookieInfo;
                var expireDate = new Date();
                //保存登录信息一周
                expireDate.setDate(expireDate.getDate() + 7);
                //写入cookie信息
                $cookies.putObject(USERKOOKIE,cookieInfo,{'expires': expireDate});
            },
            //获取userInfo
            getUserByCookie: function () {
                var cookie=$cookies.get(USERKOOKIE);
                if(cookie)
                    return JSON.parse($cookies.get(USERKOOKIE));
                else
                    null;
            },
            //获取session
            getSession: function () {
                var deferred=$q.defer();
                return this.postData(data,'/ckTaskIn/ckTaskInDetailList');
            },
            //修改密码
            updatePwd: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                return this.postData(data,'/custom/restPassWord');
            },
            //登出
            logOut: function (data) {
                data.param=$filter('json')(data.param);
                return this.postData(data,'/j_spring_security_logout');
            },
            postData: function (data,url) {
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

        }
    }]);
});