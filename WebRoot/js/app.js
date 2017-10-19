/**
 * Created by xuwusheng on 15/11/12.
 */
'use strict';
define(['angular', 'ui-route', 'ng-cookie','ng-fileUpload-shim','ng-fileUpload', 'jquery', 'datePicker', 'bootstrap-js', 'jquery-plugin','alert','ocLazyLoad','uiRouterDecorator', './services/appService', './services/menuService'], function (angular) {
    return angular.module('app', ['ui.router', 'ngCookies','ngFileUpload','oc.lazyLoad', 'oc.lazyLoad.uiRouterDecorator', 'app.service'],['$sceDelegateProvider',function($sceDelegateProvider,$ocLazyLoadProvider) {
            $sceDelegateProvider.resourceUrlWhitelist([
                'self',
                'http://172.16.1.153:8088/**',
                'http://172.16.1.150:8090/**',
                'http://172.16.1.84:8090/**',
                'http://172.16.1.146:8090/**',
                'http://172.16.7.217:8082/**',
                'http://172.16.0.137:8083/**',
                'http://172.16.0.90:8082/**',
                'http://por.ebaigee.com/**',
                'http://por2.ebaigee.com/**',
                'http://172.16.0.59:8082/**',
                'http://172.16.0.239:8080/**',
                'http://172.16.0.54:8082/**',
                'http://172.16.1:236:8082/**',
                'http://172.16.0.31:8082/**',
                'http://portal.ebaige.com/**',
                'http://express.ebaigee.com/**']);
        }])
        //配置常量
        .constant('EHOST', 'http://por.ebaigee.com')
        .constant('HOST', 'http://por2.ebaigee.com')
        .constant('TOKENKEY', 'pl4TokenKey')
        .constant('USERKOOKIE', 'PL4USERCOOKIE')
        //启动初始化数据
        .run(['$rootScope', '$cookies', '$state', '$location', '$window', 'TOKENKEY', 'USERKOOKIE', 'menuService', function ($rootScope, $cookies, $state, $location, $window, TOKENKEY, USERKOOKIE, menuService) {
            $rootScope.userInfo = undefined;
            $rootScope.menuList = [];
            $rootScope.isHomeNavClick = true;
            $rootScope.isHomeHover = false;
            $rootScope.duplication = {csrfToken: ""}
            $window.alert = $window.owAlert.alert;
            //监听路由状态
            $rootScope.$on('$stateChangeStart', function (event, toState) {
                //$('#ui-view').html('<div class="ui-view-loading" style="height: ' + ($(window).height() - $('.ct-top').height()) + 'px"><span>loading....</span></div>');
                $rootScope.isHomeNavClick = true;
                var cookie = $cookies.get(USERKOOKIE);
                $rootScope.userInfo = cookie ? JSON.parse($cookies.get(USERKOOKIE)) : undefined;
                if (toState.name != 'login') {
                    //检查是否登陆过
                    if (!$rootScope.userInfo || $rootScope.userInfo == '') {
                        event.preventDefault();
                        $state.go('login', {from: $state.current.name});
                        return;
                    }
                    if ($rootScope.isHomeNavClick) {
                        //设置菜单
                        menuService.getTreeByState(toState);
                        $rootScope.isHomeNavClick = false;

                    }
                    //切换页面移除多余时间控件
                    if ($('.datepicker').length > 0) {
                        $('.datepicker').remove();
                    }
                }
            });
            //错误处理
            $rootScope.$on('userIntercepted', function (userIntercepted, errorType, data) {
                if (errorType == 'verifyError') {
                    alert(data.message);
                    return false;
                }
                if (errorType == 'loginError') {
                    alert(data.message);
                    if ($location.$$path != '/login') {
//                       if(data.status){
//                           alert(data.status.msg);
                        alert(data.message);
                        $('.modal-backdrop').remove();
                        $('.ui-view-loading').hide();
                        $state.go('login', {from: $state.current.name});
//                       }
                    }
                }
            });
        }])
        //用户拦截器
        .factory('UserInterceptor', ['$rootScope', '$q', '$cookieStore', 'TOKENKEY', 'USERKOOKIE', function ($rootScope, $q, $cookieStore, TOKENKEY, USERKOOKIE) {
            return {

                request: function (config) { //加载等待
                    if (config.data) {
                            for (var key in $rootScope.duplication) {
                                if (key.indexOf("csrfToken") != -1) {
                                    config.data[key] = $rootScope.duplication[key];
                                }
                            }
                            //config.data.query.toString();
                           // config.data.query.JSON.stringify();
                        //console.log("赋值完成之后");
                       // console.log(config.data);
                    }
                    /*if(config.data){
                     config.data['tokenId'] =$rootScope.userInfo?$rootScope.userInfo.token:undefined;
                     config.data['sessionid'] = $rootScope.userInfo?$rootScope.userInfo.sessionid:undefined;
                     }*/

                    if (config.url && config.url.substr(0, 5) != 'views' && config.url.indexOf('ajaxInputSuccess')<=-1) {
                        $('.ui-view-loading').show();
                        config.url += '?tokenId=' + ($rootScope.userInfo ? $rootScope.userInfo.token : '');
                        config.url += '&sessionid=' + ($rootScope.userInfo ? $rootScope.userInfo.sessionId : '');
                        config.url += '&t=' + Math.random();
                        // config.url+='&'+$rootScope.duplication.csrfToken+'='+($rootScope.duplication?$rootScope.duplication[$rootScope.duplication.csrfToken]:'');
                    }
                    //请求头token信息
                    /*config.headers['tokenId'] = $rootScope.userInfo?$rootScope.userInfo.token:undefined;
                     config.headers['sessionid'] = $rootScope.userInfo?$rootScope.userInfo.sessionid:undefined;*/
                    return config;
                },
                response: function (response) {
                    // console.log(response);
                    var data = response.data;

                    if (data.data) {
                        //if(data.query.csrfToken) {
                        //    $rootScope.duplication.csrfToken = data.query.csrfToken;
                        //}
                        var obj = data.data;
                        for (var key in obj) {
                            if (key.indexOf("csrfToken") != -1) {
                                // console.log(obj[key]);
                                $rootScope.duplication[key] = obj[key];
                            }
                        }


                    }

                    if (data instanceof Object) {
                        $('.ui-view-loading').fadeOut('fast');
                        //接收错误代码
                        if (data.status) {
                            switch (data.status.code) {
                                //session超时
                                case "1002":
                                    $rootScope.$emit('userIntercepted', 'loginError', {message: data.status.msg});
                                    break;
                                case "1000":
                                    $rootScope.$emit('userIntercepted', 'verifyError', {message: data.status.msg});
                                    //$('#comfirmPrint').modal('hide');
                                    //alert(data.status.msg);
                                    break;
                            }
                        }


                    } else if (data == '' || response.status == 204) {
                        var url = response.config.url.substr(0, response.config.url.indexOf('?'));
                        alert('接口:' + url + ' \n无返回数据!');
                        $('.ui-view-loading').fadeOut('fast');
                    }

                    return response;
                },
                //处理响应错误
                responseError: function (response) {
                    //console.log(response)
                    var url = response.config.url.substr(0, response.config.url.indexOf('?'));
                    alert('接口:' + url + ' \n请求失败!');
                    $('.ui-view-loading').fadeOut('fast');
                }
            };
        }])


});