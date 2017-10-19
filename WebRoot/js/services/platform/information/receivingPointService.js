/**
 * Created by xiaojiu on 2016/11/22.
 */
define(['../../../app'], function (app) {
    app.factory('receivingPoint', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'receivingPointName',name:'收货点名称'},
                    {field:'createTime',name:'创建时间'},
                    {field:'receivingPointUserName',name:'收货点负责人'},
                    {field:'tel',name:'手机号码'},
                    {field:'receivingPointAccount',name:'收货点账号'},
                    {field:'wlDeptId',name:'关联分拨中心'},
                    {field:'provinceName',name:'省'},
                    {field:'cityName',name:'市'},
                    {field:'countyName',name:'区（县）'},
                    {field:'address',name:'详细地址'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        style:'width:50px;',
                        buttons: [{
                            text: '修改',
                            call: 'updateGift',
                            btnType: 'button',
                            openModal: '#workLogModal'
                        },{
                            text: '删除',
                            call: 'deleteCustom',
                            btnType: 'button',
                        }]
                    }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/receivingPoint/getDicLists',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },

            getDataTable: function( url, data) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                //console.log(data)
                var deferred = $q.defer();
                $http.post(HOST + url, data)
                    .success(function(data) {
                        //console.log(data)
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