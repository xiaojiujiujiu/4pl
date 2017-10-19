/**
 * author wusheng.xu
 * date 16/4/19
 */
define(['../../../app'], function (app) {
    app.factory('goodsAlloQuery', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'customerName',name:'客户'},
                    {field:'supliersName',name:'供应商'},
                    {field:'sku',name:'商品编码'},
                    {field:'productName',name:'商品品类'},
                    {field:'goodsBrandName',name:'商品品牌'},
                    {field:'modelName',name:'商品规格'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'unitName',name:'计量单位'},
                    {field:'count',name:'总数'},
                    {name:'操作',type:'operate',style:'width:79px;',buttons:[{
                        text: '查看明细',
                        btnType:'btn',
                        call:'checkDetail',
                        //openModal:'#alloModal'
                    }]}]
            },getQuery: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/ckGoodsLocation/getDicLists',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;

            },
            getAllTHeader: function () {
                return [{
                    field: 'pl4GridCount', name: '序号', type: 'pl4GridCount'
                }, {
                    field: 'huoWeiNo',
                    name: '商品货位'
                }, {
                    field: 'goodsCount',
                    name: '数量'
                }];
            },
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+(!url?'/ckGoodsLocation/goodsLocationList':url),data)
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