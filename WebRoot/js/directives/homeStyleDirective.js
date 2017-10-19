/**
 * Created by xuwusheng on 16/1/27.
 */
define(['../app'], function (app) {
    app.directive('styleChange', function(){
    	return {
    		restrict: 'A',
	    	link: function(scope, elem, attrs) {
		        var elemParentWidth = $(elem).parent().width()/2; 
		        $(elem).css({
		        	left: elemParentWidth-31+'px'
		        })
		    }
    	}
    })
});