/**
 * Created by xuwusheng on 16/1/26.
 */
define(['../app', '../services/loginService','../services/socketService'], function (app) {
	var app = angular.module('app');
    app.controller('mainCtrl', ['$rootScope', '$scope', '$cookieStore','$cookies', '$state', 'menuService', 'USERKOOKIE', 'login','socketService', function ($rootScope, $scope, $cookieStore,$cookies, $state, menuService, USERKOOKIE, login,socketService) {
        $scope.userInfo = login.getUserByCookie();
        $scope.menuRootNode = menuService.getAll();
       // $scope.menuList = menuService.getTree(0).menu;
        // console.log(menuService.getTree(0).menu)
        /*$('.left-wrapper').hide();
        $('.ct-right').css({
            'width': '100%'
        })*/
        // 首页显示仓储菜单
         $rootScope.menuList = menuService.getTree(0).menu;
        $scope.getMenu = function (i) {
            if(i==-1){
                $rootScope.isHomeHover=true;
                $state.go('main.home');
                // 首页显示仓储菜单
                $rootScope.menuList = menuService.getTree(0).menu;
                return;
            }else{
                $rootScope.isHomeHover=false;
                $rootScope.menuList = menuService.getTree(i).menu;
            }
            var expireDate = new Date();
            //保存登录信息一周
            expireDate.setDate(expireDate.getDate() + 7);
            //写入cookie信息
            $cookies.put('menuListType', [i],{'expires': expireDate});
            if(i==-1){
                $rootScope.isHomeHover=true;
                $state.go('main.home');
                 $rootScope.menuList = menuService.getTree(0).menu;
                return;
            }else{
                $rootScope.isHomeHover=false;
                $rootScope.menuList = menuService.getTree(i).menu;
            }

        }
        var favoriteCookie = $cookies.get('menuListType');
        if(favoriteCookie=="1"){
            $rootScope.menuList = menuService.getTree(1).menu;
        }
        $scope.headerIcons=['header-storage','header-logistics','header-platform'];
        //退出
        $scope.logOut = function () {
            login.logOut({param:{tokenId:$scope.userInfo.token}})
                .then(function (data) {
                    if(data.status.code=='0000'){
                        $cookieStore.remove(USERKOOKIE);
                        menuService.removeTree();
                        $state.go('login', {});
//                        socketService.emit('exit',{"uuid":$scope.userInfo.account});
                    }else {
                        alert(data.status.msg);
                    }
                })
        }
        var userinfo= login.getUserByCookie();
        $scope.isHide=false;
        if(userinfo.barricade===true){
            $('#updatePwd').modal('show');
            $scope.isHide=true;
        }
        $scope.userinfo=userinfo;
        //密码model
        $scope.userPwd = {
            account: $scope.userInfo.account,
            pwd: '',
            enterPwd: '',
            newPwd: ''
        };
        //修改密码
        $scope.enterUpdate = function () {
            if($scope.userPwd.enterPwd!=$scope.userPwd.newPwd){
                alert('两次密码不一致!');
                return;
            }
            if($scope.userPwd.enterPwd===$scope.userPwd.pwd){
                alert('新密码不能与旧密码相同!');
                return;
            }
            login.updatePwd({param:$scope.userPwd})

                .then(function (data) {
                    //alert(data.status.msg);
                    if (data.status.code=="0000"){
                        $('#updatePwd').modal('hide');
                        alert(data.status.msg,function(){
                            $state.go('login', {from: $state.current.name});
                        });

                        $scope.userPwd = {
                            account: $scope.userInfo.account,
                            pwd: '',
                            enterPwd: '',
                            newPwd: ''
                        };
                    }
                }, function (error) {

                });
        }
        $scope.deleteGrid = function () {
            $scope.userPwd = {
                account: $scope.userInfo.account,
                pwd: '',
                enterPwd: '',
                newPwd: ''
            };
        }
        $scope.leftShow=true;
        $scope.isActive=true;
        $scope.treeToggle = function () {
            $scope.leftShow=!$scope.leftShow;
            $scope.isActive=!$scope.isActive;
        }

    }]);
});