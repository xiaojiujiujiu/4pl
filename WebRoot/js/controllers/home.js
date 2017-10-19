/**
 * Created by xuwusheng on 15/11/12.
 */
'use strict';
define(['../app'], function (app) {
     var app = angular.module('app');
    app.controller('HomeCtrl',['$scope','$http',function ($scope,$http) {
        //$http.get('http://192.168.30.16:8080/sendTask/order?order=%E2%80%98zgding%E2%80%99')
        //    .success(function (data) {
        //        console.log(data)
        //    }).error(function () {
        //        console.log('error')
        //    });
    }]);
});
