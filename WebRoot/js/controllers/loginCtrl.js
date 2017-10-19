/**
 * Created by xuwusheng on 16/1/26.
 */
define(['../app', '../services/loginService', '../services/menuService','../services/socketService'], function (app) {
	var app = angular.module('app');
     app.controller('loginCtrl', ['$rootScope', '$scope', 'login', '$state', '$stateParams', 'menuService','socketService', function ($rootScope, $scope, loginService, $state, $stateParams, menuService,socketService) {
        $scope.loginTitle = '登录';
        $scope.loginError = false;
        var from = $stateParams["from"];
        $rootScope.isHomeNavClick = true;
        //$rootScope.userInfo=loginService.getUserByCookie();
        $scope.user = {
            j_username: ($rootScope.userInfo ? $rootScope.userInfo.userName : ''),
            j_password: ''
        }
        menuService.removeTree();
        $scope.btnLogin = function () {
            $scope.loginTitle = '正在登录...';
            loginService.signIn($scope.user)
                .then(function (data) {
                    if (data.code == "0000") {
                        $scope.loginTitle = '登录成功';
                        //写入cookie信息
                        loginService.putCookie(data.result);
//                        console.log(data.result);
                        menuService.setTree(data.result.menuTree);
//                        socketService.emit('register',{"uuid":data.result.account,"account":data.result.account,"username":data.result.name});
//                        socketService.on('notification', function (data) {
//                          console.log(data.msg);
//                        });
                        $state.go(from ? from : 'main.home');
                    } else {
                        $scope.loginTitle = '登录';
                        $scope.loginError = true;
                        $scope.btnLogin.loginError=data.status.msg;
                        //console.log($scope.loginError);
                        return false;
                        // alert(data.message);
                    }
                }, function (error) {
                    console.log(error)
                });


        }
        $scope.pwdKeyup = function (e) {
            if (e.keyCode == 13) {
                $scope.btnLogin();
            }
        }
        

    }]);
});