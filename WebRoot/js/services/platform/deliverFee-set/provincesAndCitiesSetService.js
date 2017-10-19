/**
 * Created by xuwusheng on 15/12/21.
 */
define(['../../../app'], function (app) {
    app.factory('provincesAndCitiesSet', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {field:'depProvince',name:'省'},
                    {field:'depCity',name:'市'},
                    {field:'depArea',name:'区'},
                    {field:'firstHeavy',name:'首重(公斤)'},
                    {field:'firstHeavyPrice',name:'首重价格(元)'},
                    {field:'continuedHeavyPrice',name:'续重价格(元/公斤)'},
                    {field:'volume',name:'标准体积(立方米)'},
                    {field:'volumePrice',name:'标准体积内价格(元)'},
                    {field:'overVolumePrice',name:'标准体积外价格(元/立方米)'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'修改',btnType:'btn',call:'updateStation',openModal:'#addStation'}]
                    }
                ]
            },
            getDataTable: function (url,data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url, data)
                    .success(function (data) {
                        deferred.resolve(data);
                       // console.log(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            }
            
        }
    }]);
});