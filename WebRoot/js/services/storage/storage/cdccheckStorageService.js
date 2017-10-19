/**
 * Created by xuwusheng on 15/11/16.
 */
'use strict';
define(['../../../app'], function (app) {
    app.factory('cdccheckStorage', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
              return [{name:'序号',
                  type:'pl4GridCount'},
                  {field: 'supplier',name: '供应商'},
                  {field:'sku',name:'商品编码'},
                  {field:'goodsName',name:'商品名称'},
                  {field:'goodsStyle',name:'规格型号'},
                  {field:'brand',name:'商品品牌'},
                  {field:'serialNumber',name:'出厂编码'},
                  {field:'goodsUnit',name:'计量单位'},
                  {field:'goodsCount',name:'应收数量'},
                  {field:'inCount',name:'实收数量',input:true,style:"width:80px;",id:'inCount',call:'clearNoNum',}
                  //{field:'inDiffCount',name:'差异数量'},
                  //{field:'op',name:'操作',type:'operate',style:'width:108px;',buttons:[{text:'编辑差异', call: 'editDate', btnType: 'button', style: 'font-size:10px;', openModal:'#editDate'}]}
              ]
            },
            getSearch: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/ckTaskIn/getDetailDicLists',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+(!url?'/inGoodsOrder/inGoodsOrderDetailList':url),data)
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