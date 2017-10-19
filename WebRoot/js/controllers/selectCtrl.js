/**
 * Created by hui.sun on 15/11/16.
 */
'use strict';
define(['../app'], function(app) {
	 var app = angular.module('app');   app.controller('selectCtrl', ['$scope', function($scope) {
		$scope.chinaCities = [
		    { py: 'sh', province: '上海', cities: ['上海'] },
		    { py: 'bj', province: '北京', cities: ['北京'] },
		    { py: 'hb', province: '湖北', cities: ['武汉','鄂州','恩施','黄冈','黄石','荆门','荆州','十堰','随州','咸宁','襄阳','孝感','宜昌'] },
		    { py: 'zj', province: '浙江', cities: ['杭州','宁波','湖州','嘉兴','金华','绍兴','台州','温州','舟山','衢州','丽水'] },
		    { py: 'nmg', province: '内蒙古', cities: ['呼和浩特','包头','阿拉善','巴彦淖尔','赤峰','呼伦贝尔','乌海','乌兰察布','锡林郭勒','兴安','鄂尔多斯','通辽'] },
		    { py: 'yn', province: '云南', cities: ['昆明','西双版纳','保山','楚雄','大理','德宏','红河','丽江','临沧','怒江','曲靖','思茅','文山','玉溪','昭通','迪庆州'] }
		];
	}])
});