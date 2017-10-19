/**
 * Created by xiaojiu on 2017/2/4.
 */
define(['../../../app'], function (app) {
    app.factory('barcodeInformation', ['$http', '$q', '$filter', '$sce', 'HOST', function ($http, $q, $filter, $sce, HOST) {
        return {
            getThead1: function () {
                return [
                    {field: 'pl4GridCount', name: '序号', type: 'pl4GridCount'},
                    {field: 'customerName', name: '客户'},
                    {field: 'supplierName', name: '供应商'},
                    {field: 'sku', name: '商品编码'},
                    {field: 'goodsType', name: '商品品类'},
                    {field: 'goodsBrand', name: '商品品牌'},
                    {field: 'modelName', name: '商品规格'},
                    {field: 'goodsName', name: '商品名称'},
                    {field: 'factoryCode', name: '出厂编码'},
                    {field: 'barCodeTypeName', name: '条码类型'},
                    {field: 'unitName', name: '计量单位'},
                    {field: 'manufactureDate', name: '生产日期'},
                    {field: 'expiryDate', name: '失效日期'},
                    {field: 'goodsBarSerialNumber', name: '序列号'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        buttons:  [{
                            text: '编辑',
                            call: 'editDate',
                            btnType: 'button',
                            style: 'font-size:10px;',
                            //openModal:'#editDate'
                        },{
                            text:'打印',
                            btnType: 'btn',
                            call:'print',
                            style: 'font-size:10px;'
                        }]
                    }
                ]
            },
            getThead2: function () {
                return [
                    {name: '',check:true,checkAll:true},
                    {field: 'taskId', name: '容器码'},
                    {field: 'createTime', name: '状态'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        buttons:  [{text:'冻结',btnType:'btn',call:'perFreeze'},{text:'恢复',btnType:'btn',call:'perResume'}
                        ]
                    }
                ]
            },
            getDataTable: function (data,url) {
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
    }])
})