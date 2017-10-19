/**
 * Created by hui.sun on 15/11/13.
 */
'use strict';
define(['../app'], function(app) {
	app.directive('pl4Select', function() {
		return {
			restrict: 'EA',
			replace: true,
			template: '<div class="select-direvtive">'+
					  '<div class="form-group">'+
					  '<label>{{selectSetting.firstName}}：</label>'+
					  '<select class="form-control" ng-model="your.province"ng-options="v.province for v in chinaCities" ng-change="selectedFirstValue(your.province)">'+
					  '</select>'+
					  '</div>'+
					  '<div class="form-group">'+
					  '<select class="form-control" ng-model="your.city" ng-options="v for v in your.province.cities">'+
					  '</select></div></div>',
			link: function($scope, el, attr) {
				// console.log($scope)
				$scope.your = {
				    province: '',
				    city: ''
				};
			    $scope.your.province = $scope.chinaCities[0];
			    $scope.your.city = $scope.chinaCities[0].cities[0];
			    $scope.selectedFirstValue = function(province) {
			        $scope.your.city = province ? province.cities[0] : '';
			    };
			}
		}
	});
});