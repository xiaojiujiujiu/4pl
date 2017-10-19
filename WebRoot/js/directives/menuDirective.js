/**
 * Created by xuwusheng on 15/11/13.
 */
'use strict';
define(['../app'], function (app) {
    app.directive('menu', [function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: '<ul class="left-menu" ng-transclude ></ul>',
            controller: function () {
                var expanders = [];
                this.open = function (s) {
                    angular.forEach(expanders, function (exp) {
                        if (exp.scope != s) {
                            exp.scope.menuChange = false;
                            //exp.scope.menuItem.change=false;
                            exp.el.find('span').addClass('menu-item-right').removeClass('menu-item-down');
                            exp.el.find('a').eq(0).removeClass('hover');
                            //  exp.el.find('a').removeClass('hover');
                        }
                    });
                }
                this.addExpander = function (exp) {
                    expanders.push(exp);

                }
            },
            link: function ($scope, el) {

                $(el).on('click', '.subMenu', function () {
                    $('.subMenu').removeClass('hover');
                    $(this).addClass('hover');
                });
            }
        }
    }])
    app.directive('menuList', [function () {
        return {
            restrict: 'EA',
            require: '^menu',
            replace: true,
            transclude: true,
            scope: {
                'menuItem': '=menuItem'
            },
            templateUrl: 'views/menu.html',
            link: function ($scope, el, attr, menuController) {
                $scope.menuChange = $scope.menuItem.change;
                var saveEle = { scope: $scope, el: el };
                menuController.addExpander(saveEle);
                $scope.$watch('menuItem.change', function () {
                    /// console.log("changed:" + $scope.menuItem.text)
                    $scope.menuChange = $scope.menuItem.change;
                });
                $scope.menuToggle = function () {
                    //span 箭头
                    $scope.menuChange = !$scope.menuChange;
                    //$scope.menuItem.change =!$scope.menuItem.change;//! $scope.menuChange;
                    menuController.open($scope);
                    el.find('span').hasClass('menu-item-right') ?
                        el.find('span').addClass('menu-item-down').removeClass('menu-item-right') :
                        el.find('span').addClass('menu-item-right').removeClass('menu-item-down');
                    el.parent().find('li').removeClass('hover');
                    $scope.menuChange ? el.addClass('hover') : el.removeClass('hover');
                    //console.log()
                    $scope.menuChange ? el.find('a').eq(0).addClass('hover') : el.find('a').eq(0).removeClass('hover');
                }
            }
        }
    }]);
});