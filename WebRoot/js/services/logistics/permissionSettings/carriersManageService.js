/**
 * Created by hui.sun on 15/12/12.
 */
define(['../../../app'], function (app) {
    app.factory('carriersManage', ['$http','$q','HOST','$filter',function ($http,$q,HOST,$filter) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'carrierId',name:'配送服务商编号'},
                    {field:'carrierName',name:'配送服务商名称'},
                    {field:'carrierMan',name:'配送服务商联系人'},
                    {field:'mobilephone',name:'联系人手机号'},
                    {field:'carrierAddress',name:'配送服务商所在地'},
                    {field:'carrierRange',name:'配送范围'},
                    {
                    	field:'op',
                    	name:'操作',
                    	type: 'operate',
                    	buttons: [{
			                text: '修改',
	                        call: 'updateCustom',
	                        btnType: 'button',
	                        style: 'font-size:10px;',
	                        openModal: '#orderLogModal'
			            }/*,{
			            	text: '删除',
			            	call: 'removeCustom',
			            	btnType:'button',
			            }*/,{text:'|'},{
							text: '冻结',
							call: 'cmFreeze',
							btnType:'button',
						},{text:'|'},{
							text: '恢复',
							call: 'cmResume',
							btnType:'button',
						}]
                    }]
            },
            getDataTable: function(data,url) {
            	// console.log(data)
		        //将parm转换成json字符串
		        data.param = $filter('json')(data.param);
		        var deferred = $q.defer();
		        $http.post(HOST + url, data)
		          .success(function(data) {
		            // console.log(data)
		            deferred.resolve(data);
		          })
		          .error(function(e) {
		            deferred.reject('error:' + e);
		          });
		        return deferred.promise;
		    }
        }
    }]);
});