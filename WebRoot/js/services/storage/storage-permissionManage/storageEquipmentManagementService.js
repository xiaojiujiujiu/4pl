/**
 * Created by xiaojiu on 2017/3/25.
 */
define(['../../../app'], function (app) {
    app.factory('storageEquipmentManagement', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'useStaff',name:'使用/保管人员'},
                    {field:'equipmentType',name:'设备类型'},
                    {field:'type',name:'型号'},
                    {field:'SNCode',name:'SN码'},
                    {field:'equipmentName',name:'设备名称'},
                    {field:'number',name:'数量'},
                    {field:'price',name:'单价'},
                    {field:'money',name:'金额'},
                    {field:'buyTime',name:'购入时间'},
                    {field:'ownership',name:'权属'},
                    {field:'remark',name:'备注'},
                    {field:'inDiffCount',name:'操作',type:'operate',
                        buttons:[
                            {text:'修改',btnType:'btn',call:'updateStation',openModal:'#addEquipment'},
                            {text:'删除',call:'delete'},
                            {text:'打印条码',call:'print'}
                        ]
                    }]
           
            },
            getDataTable: function (url, data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url,data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getDataAdd: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url,data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            }
        }
    }]);
});