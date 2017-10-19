/**
 * Created by Richard on 16/11/23.
 */
define(['../app'], function (app) {
    app.directive('pl4Autocomplete', [function () {
        return {
            restrict:'EA',
            link: function ($scope,el,attr) {
            	var m = attr.pl4Autocomplete;
            	if(m){
            		var autocallback = attr.autocallback;
            		m = "searchModel."+m;
            		var clearWatch = $scope.$watch(m, wc);
            		function wc(newValue, oldValue) {
                        if (newValue != oldValue /**&& $scope.selectionMade == false*/) {
                            if (newValue != "" && !angular.isUndefined(newValue)) {
                            	if(autocallback){
                            		$scope.$parent.visible=true;
                            		var promise =$scope.$parent[autocallback](newValue);
                            		if(promise){
                            			promise.then(function(data) {
                            				if(angular.isArray(data)){
                            					if(data.length>0){
                            						$scope.dropDownList.splice(0,$scope.dropDownList.length);
                                					angular.forEach(data, function (item) {
                                						item.clearWatch=function(){
                                        					clearWatch();
                                        				};
                                        				item.resumeWatch=function(){
                                        					clearWatch = $scope.$watch(m, wc);
                                        				};
                                        				$scope.dropDownList.push(item);
														item.callback=function(){
															try {
																$scope.$parent["callback"](item);
															}catch (e){
																console.log("can not find callback");
															}

														};
                                    	            });
                            					}else{
                            						$scope.$parent.visible=false;
                            					}
                            					
                            				}else{
                            					data.clearWatch=function(){
                                					clearWatch();
                                				};
                                				data.resumeWatch=function(){
                                					clearWatch = $scope.$watch(m, wc);
                                				};
                                				$scope.dropDownList.splice(0,$scope.dropDownList.length);
                                                $scope.dropDownList.push(data);
												data.callback=function(){
													$scope.$parent["callback"](data);
												};
                            				}
                                        });
                            		}
                            	}
                            } 
                        }
                    };
            	}
                
            }
        }
    }]);
    
    app.directive('pl4DropDown', ['$document',function ($document) {

        return {
            restrict:'EA',
            replace:true,
            template:'<ul ng-show="visible" class="autoplete-ul form-control"><li ng-click="$whyMe(v)" ng-repeat="v in dropDownList" id="{{v.id}}">{{v.name}}</li></ul>',
			//<li style="text-align: right"><button style="margin-right: 0;" class="btn btn-query btn-primary" ng-click="close()">关闭</button></li>
            link: function ($scope,el,attr) {
            	$scope.$parent.visible=false;
            	var m = attr.ngmodel;
            	var nm = attr.ngmodelname;
            	$scope.$whyMe=function(v){
            		$scope.searchModel[m]=v.id;
            		if(v.clearWatch){
            			v.clearWatch();
            		}
            		$scope.searchModel[nm]=v.name;
            		if(v.resumeWatch){
            			v.resumeWatch();
            		}
            		$scope.$parent.visible=false;
					if(v.callback){
						v.callback();
					}
                }
            	$document.bind("click", function(event) {
            		$scope.$parent.visible=false;
            		$scope.$apply();//需要手动刷
            	});
            }
        }
    }]);
    
    
});