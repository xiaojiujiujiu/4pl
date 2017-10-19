/**
 * Created by hui.sun on 16/3/7.
 */
'use strict';
define(['../app', '../services/loginService'], function (app) {
	var app = angular.module('app');
     app.controller('homeCtrl',['$rootScope','$scope', '$http', '$cookies','HOST','USERKOOKIE','$filter','login','$state', function ($rootScope,$scope, $http, $cookies,HOST,USERKOOKIE,$filter,loginService,$state) {
	        var cookie=$cookies.get(USERKOOKIE),
	        	userId;
            if(cookie){
            	userId = JSON.parse($cookies.get(USERKOOKIE)).userId;
            }

            var sendData = {
            	param: {
	        		query: {
		        		userId: userId
		        	}
	        	}
            }
		   var userinfo= loginService.getUserByCookie();
		 $scope.isHide=false;
		 if(userinfo.barricade===true){
			 $('#updatePwd').modal('show');
			 $scope.isHide=true;
		 }
		   $scope.userinfo=userinfo;
		   //console.log(userinfo.name);
            sendData.param = $filter('json')(sendData.param);
           /* $scope.homeData = {
            	storageData: [],
            	logisticsData: [],
            	platformData: []
            };
	        $http.post(HOST+'/index/data',sendData)
	            .success(function (data) {
	            	//console.log(data)
	            	angular.forEach(data.grid, function(item, index){
	            		angular.forEach(item.menu, function(val, key){
	            			angular.forEach(val.children, function(i,j){
	            				// console.log(item)
	            				if(item.typeName == '仓储系统'){
			            			$scope.homeData.storageData.push(i);
			            		}else if(item.typeName == '物流系统'){
			            			$scope.homeData.logisticsData.push(i);
			            		}else{
			            			$scope.homeData.platformData.push(i);
			            		}
	            			})
	            		})
	            	})

	            })
	            .error(function (e) {
	            	console.log(e)
	            });*/
			$scope.homeData = [];
			$http.post(HOST+'/index/data',sendData)
				.success(function (data) {
					//console.log(data)
						$scope.homeData=data.grid;
				})
				.error(function (e) {
					console.log(e)
				});
	        $scope.myVar = true;
	        $scope.hideMessage = function(){
	        	$scope.myVar = !$scope.myVar;
	        }
		$scope.homeNavClick= function () {
			$rootScope.isHomeNavClick = true;
		}

    }]);
});
