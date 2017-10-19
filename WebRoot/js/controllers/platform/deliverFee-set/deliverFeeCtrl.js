/**
 * author wusheng.xu
 * date 16/6/21
 */
define(['../../../app', '../../../services/platform/deliverFee-set/deliverFeeService', '../../../services/addressLinkageService'], function (app) {
     var app = angular.module('app');
    app.controller('deliverFeeCtrl', ['$scope', '$sce', 'deliverFee', 'addressLinkage', function ($scope, $sce, deliverFee, addressLinkage) {
        $scope.navShow = true;
        //新增模型
        $scope.deliverFeeModel= {
        		firstHeavy:'',
        		firstHeavyPrice:'',
                continuedHeavyPrice:'',
                depProvince:'',
                desProvince:'',
                feeType:'',
                heavyPrice:'',
                lightPrice:'',
                id:''
            };
        
        //新增模型
        $scope.deliverModel= {
        		heavy:'',
        		volume:''
            };
        
        $scope.searchModel = {
        		depProvince: [],
        		depCity: [{id: '-1', name: '全部'}],
        		desProvince: [],
        		desCity: [{id: '-1', name: '全部'}],
        		
            }
        $scope.searchModelAccuratel={
            desProvince: [],
        }
            //获取省
            addressLinkage.getProvince({"param":{"query":{"isAllFlag":2,"parentId":0}}})
                .then(function (data) {
                    $scope.searchModel.depProvince=angular.extend([],data.query.areaInfo,[]);
                    $scope.searchModel.depProvinceSelected=-1;
                    $scope.searchModel.depCitySelected=-1;
                    $scope.searchModelAccuratel.depProvince=angular.extend([],data.query.areaInfo,[]);
                    $scope.searchModelAccuratel.desProvinceSelected=-1;
                    $scope.searchModel.desProvince=angular.extend([],data.query.areaInfo,[]);
                    if($scope.searchModel.desProvince.length>0){
                        $scope.searchModel.desProvince.splice(0,1);
                    }
                }, function (error) {
                    console.log(error);
                });

        
        //省 选择事件
        $scope.searchModel.depProvinceChange = function (call) {
            var opt = {
                query: {parentId: $scope.searchModel.depProvinceSelected}
            }

            //获取市
            addressLinkage.getCity({param:opt})
                .then(function (data) {
                    $scope.searchModel.depCity = data.query.city;
                    if(!(call instanceof Function))
                        $scope.searchModel.depCitySelected = '-1';
                    else
                        call();
                }, function (error) {
                    console.log(error)
                });
        }

        //省 选择事件
        $scope.searchModel.desProvinceChange = function (call) {
            var opt = {
                query: {parentId: $scope.searchModel.desProvinceSelected}
            }

            //获取市
            addressLinkage.getCity({param:opt})
                .then(function (data) {
                    $scope.searchModel.desCity = data.query.city;
                    if(!(call instanceof Function))
                        $scope.searchModel.desCitySelected = '-1';
                    else
                        call();
                }, function (error) {
                    console.log(error)
                });
        }
        //省 选择事件
        $scope.searchModelAccuratel.desProvinceChange = function (call) {
            var opt = {
                query: {parentId: $scope.searchModelAccuratel.desProvinceSelected}
            }

            //获取市
            addressLinkage.getCity({param:opt})
                .then(function (data) {
                    $scope.searchModel.desCity = data.query.city;
                    if(!(call instanceof Function))
                        $scope.searchModel.desCitySelected = '-1';
                    else
                        call();
                }, function (error) {
                    console.log(error)
                });
        }
        //添加按钮
        $scope.btnAddJzDeliverFee= function () {
            $scope.addDeliverFeeTitle='新建配送费标准';
            $scope.deliverFeeModel= {
            		firstHeavy:'',
            		firstHeavyPrice:'',
                    continuedHeavyPrice:'',
                    feeType:''
                };
            $scope.searchModel.depProvinceSelected=-1;
            $scope.searchModel.depCitySelected='-1';
            $scope.searchModel.desProvinceSelected=-1;
            $scope.searchModelAccuratel.desProvinceSelected=-1;
            $scope.searchModel.desCitySelected = '-1';
        }

        
        
        
//        //table头
//        $scope.thHeader = addDeliverFee.getThead();
        //分页下拉框
        $scope.pagingSelect = [
            {value: 5, text: 5},
            {value: 10, text: 10, selected: true},
            {value: 20, text: 20},
            {value: 30, text: 30},
            {value: 50, text: 50}
        ];
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        
        $scope.deliverModel= {
        		heavy:'',
        		volume:''
            };
        //模式选择设置
        $scope.inputHeavy=true;
        $scope.textHeavy=false;
        $scope.enterMsAddText="确定";
        $scope.enterMsAdd= function () {

            if($scope.deliverModel.heavy<=0){
                alert('重量不能小于0!');
                return;
            }
            if($scope.deliverModel.volume <=0){
                alert('体积不能小于0!');
                return;
            }
            if($scope.inputHeavy||!$scope.textHeavy||$scope.enterMsAddText=="确定"){
                $scope.inputHeavy=false;
                $scope.textHeavy=true;
                $scope.enterMsAddText="修改";
            }else {
                $scope.inputHeavy=true;
                $scope.textHeavy=false;
                $scope.enterMsAddText="确定";
                return;
            }
            deliverFee.getDataTable(
            	{
                    param: {query: $scope.deliverModel}
                },
                '/deliverFee/setDeliverFeeTypeQuery'
            ).then(function (data) {
            	 alert(data.status.msg);
                if(data.code==-1){
                	
                }
            }, function (error) {
                console.log(error);
            });
        }


        
        //添加标准模式
        $scope.enterAdd= function () {
            if($scope.searchModel.depProvinceSelected==-1){
                alert('请选择出发地!');
                return;
            }
            var isChecked=true,ids='';
            angular.forEach($scope.searchModel.desProvince, function (item) {
                if(item.$isChecked){
                    if(item.id.toString() == $scope.searchModel.depProvinceSelected.toString()){
                        alert('出发地和目的地不能相同!');
                        isChecked=false;
                        return false;
                    }
                    ids+=item.id+',';
                }
            });
            if(!isChecked) return false;
            var opt=angular.extend({},$scope.deliverFeeModel,{});
            if(ids!='')
                ids=ids.substr(0,ids.length-1);
            opt.desProvince=ids;
            opt.depProvince=$scope.searchModel.depProvinceSelected;
            if(opt.desProvince==''){
                alert('请选择目的地!');
                return;
            }
            opt.feeType=1;
//            deliverFee.getDataTable({
//                param: {
//                    query:opt
//                }
//            }, '/deliverFee/queryDeliverFeeList')
        
//            var opts=$scope.deliverFeeModel;
//            opts['depProvince']=$scope.searchModel.depProvinceSelected;
//            opts['desProvince']=$scope.searchModel.desProvinceSelected;
            
            //opts['id']=$scope.addDeliverFeeTitle=='新建配送费标准'?0:customID;
            
            var url=$scope.addDeliverFeeTitle == '新建配送费标准'?'/deliverFee/insertDeliverFee'
					:'/deliverFee/updateDeliverFee';
            
            deliverFee.getDataTable(
            	{
                    param: {query: opt}
                },
            	url
            ).then(function (data) {
                alert(data.status.msg);
                if(data.status.code=="0000"){
                	getGrid(0);
                    $('#addDeliverFeeModal').modal('hide');
                }else if(data.code==-1) {
                	 alert(data.message);
                }
            }, function (error) {
                console.log(error);
            });
        }


        //市的显示隐藏
        $scope.cityShow={show: false};
        $scope.toggleCity=function(){
            $scope.cityShow.show=!$scope.cityShow.show;
        }
        $scope.closeCityCheck= function (e) {
            if(!$(e.target).hasClass('des-province')&&!$(e.target).hasClass('des-province-check'))
                $scope.cityShow.show=false;
        }

        //添加标准模式
        $scope.enterJzAdd= function () {
            if($scope.searchModel.depProvinceSelected=='-1'){
                alert('请选择出发地!');
                return;
            }
           
            if($scope.searchModelAccuratel.desProvinceSelected == '-1'){
                alert('请选择目的地!');
                return;
            }
            if($scope.searchModel.depProvinceSelected == $scope.searchModelAccuratel.desProvinceSelected){
                alert('出发地省和目的地省不能相同!');
                return;
            }
            $scope.deliverFeeModel.depProvince=$scope.searchModel.depProvinceSelected;
            $scope.deliverFeeModel.desProvince=$scope.searchModelAccuratel.desProvinceSelected;
            $scope.deliverFeeModel.depCity=$scope.searchModel.depCitySelected;
            $scope.deliverFeeModel.desCity=$scope.searchModel.desCitySelected;
            
            $scope.deliverFeeModel.feeType=2;
            var url=$scope.addDeliverFeeTitle == '新建配送费标准'?'/deliverFee/insertDeliverFee'
					:'/deliverFee/updateDeliverFee';
            
            deliverFee.getDataTable(
            	{
                    param: {query: $scope.deliverFeeModel}
                },
            	url
            ).then(function (data) {
                alert(data.status.msg);
                if(data.status.code=="0000"){
                	console.log(data);
                	getGrid(1);
                    $('#addJzDeliverFeeModal').modal('hide');
                }else if(data.code==-1) {
                	 alert(data.message);
                }
            }, function (error) {
                console.log(error);
            });
        }
        
        $scope.addDeliverFeeTitle='新建配送费标准';
       // var customID=0;
        //修改
        $scope.updateDeliverFee= function (i,item) {
            $scope.addDeliverFeeTitle='修改配送费标准';
            $scope.deliverFeeModel= {
            	firstHeavy:item.firstHeavy,
            	firstHeavyPrice:item.firstHeavyPrice,
                continuedHeavyPrice:item.continuedHeavyPrice
            };
            $scope.deliverFeeModel.id=item.id;

            angular.forEach($scope.searchModel.depProvince, function (k) {
                if(k.name==item.depProvince){
                    $scope.searchModel.depProvinceSelected=k.id;
                }
            })
            $scope.deliverFeeModel.desProvince=item.desProvince;
            var _desProvinces=item.desProvince.split(',');
           angular.forEach($scope.searchModel.desProvince, function (k) {
               k.$isChecked=false;
               _desProvinces.forEach(function (v) {
                   if(k.name==v){
                       k.$isChecked=true;
                   }
               })
           })
        }
        
        //修改
        $scope.updateJzDeliverFee= function (i,item) {
        	//console.log(item);
            $scope.addDeliverFeeTitle='修改配送费标准';
            
            $scope.deliverFeeModel= {
             		heavyPrice:item.heavyPrice,
             		lightPrice:item.lightPrice
                 
             };
            $scope.deliverFeeModel.id=item.id;

            deliverFee.getDataTable(
                	{
                        param: {query: $scope.deliverFeeModel}
                    },
                	'/deliverFee/initUpdateDeliverFee'
                ).then(function (data) {
                if(data.status.code=="0000"){
                    $scope.searchModel.depProvinceSelected=parseInt(data.query.depProvince);
                    $scope.searchModel.depProvinceChange(function () {
                        $scope.searchModel.depCitySelected=data.query.depCity;
                    });
                    $scope.searchModelAccuratel.desProvinceSelected=parseInt(data.query.desProvince);
                    $scope.searchModelAccuratel.desProvinceChange(function () {
                        $scope.searchModel.desCitySelected=data.query.desCity;
                    });
                    }
                }, function (error) {
                    console.log(error);
                });
            
            

           
        }
      $scope.cityMultiple= function (item) {
          var regName = new RegExp('(' + item.name + ')(,)*');
          if(!item.$isChecked){
              $scope.deliverFeeModel.desProvince = $scope.deliverFeeModel.desProvince.replace(regName, '');
              if ($scope.deliverFeeModel.desProvince.substr($scope.deliverFeeModel.desProvince.length-1) == ',') {
                  $scope.deliverFeeModel.desProvince = $scope.deliverFeeModel.desProvince.substr(0,$scope.deliverFeeModel.desProvince.length-1);
              }
          }else {
              $scope.deliverFeeModel.desProvince+=($scope.deliverFeeModel.desProvince.length==0?'':',')+item.name;
          }
      }

        //新增
        $scope.btnAddDeliverFee=function(){
            angular.forEach($scope.searchModel.desProvince,function(tiem){
                tiem.$isChecked=false;
            })
           $scope.deliverFeeModel.desProvince="";
            $scope.deliverFeeModel.firstHeavy='';
            $scope.deliverFeeModel.firstHeavyPrice='';
            $scope.deliverFeeModel.continuedHeavyPrice='';
            $scope.searchModel.depProvinceSelected=-1;
        }
        //分页下拉框
        $scope.pagingSelect = [{
            value: 5,
            text: 5
        }, {
            value: 10,
            text: 10,
            selected: true
        }, {
            value: 20,
            text: 20
        }, {
            value: 30,
            text: 30
        }, {
            value: 50,
            text: 50
        }];
        //分页对象1
        $scope.paging1 = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //分页对象2
        $scope.paging2 = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var assignFlag = 1;
        $scope.gridThHeader1 = deliverFee.getThead1();
        $scope.navClick = function (i) {
//            $scope.pageModel.vmiSelect.select1.id = -1;
//            $scope.pageModel.vmiSelect.select2.id = '-1';
//            $scope.pageModel.vmiSelect.select2.data = [{id:'-1',name:'全部'}];
//            $scope.pageModel.distributionSelect.select1.data = [{id:-1,name:'全部'}];
//            $scope.pageModel.distributionSelect.select1.id = -1;
//            $scope.pageModel.distributionSelect.select2.id = -1;
//            $scope.pageModel.distributionSelect.select2.data = [{id:-1,name:'全部'}];
            if (i == 0) {
                assignFlag = 1;
                $scope.navShow = true;
                $scope.gridThHeader1 = deliverFee.getThead1();
            } else {
                assignFlag = 2;
                $scope.navShow = false;
                $scope.gridThHeader2 = deliverFee.getThead2();
            }
            getGrid(i);
        }
        
        
        function get(searchName) {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
//            if( searchName != undefined ){
//                opts.customerName = searchName;
//            }
            var promise = deliverFee.getDataTable(
                '/deliverFee/queryDeliverFeeList',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                if(data.code==-1){
                    alert(data.message);
                    $scope.result = [];
                    $scope.paging = {
                        totalPage: 1,
                        currentPage: 1,
                        showRows: $scope.paging.showRows,
                    };
                    return false;
                }
                $scope.result = data.grid;
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
                // console.log($scope.paging)

                // $scope.paging.totalPage = data.total;
            }, function (error) {
                console.log(error);
            });
        }
        
        //取得模式选择设置
        function getDeliverModel() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.deliverModel, {}); //克隆出新的对象，防止影响scope中的对象
            var promise = deliverFee.getDataTable(
            		{
                        param: {
                           
                        }
                    },
                '/deliverFee/getDeliverFeeTypeQuery'
                
            );
            promise.then(function (data) {
                if(data.code==-1){
                    alert(data.message);
                    return false;
                }
                $scope.deliverModel.heavy = data.query.heavy;
                $scope.deliverModel.volume = data.query.volume;
           
            }, function (error) {
                console.log(error);
            });
        }
        
        //查询
        $scope.btnClick = function (i) {
            $scope['paging'+(i+1)] = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope['paging'+(i+1)].showRows
            };
            getGrid(i);
            
        }
        $scope.gridResult1Paging={
            pageNo:1,
            pageSize:10
        }
        function getGrid(i) {
        	
        	getDeliverModel();
        	
            var opt = {};
            if (i == 0) {
                opt = {
                    page: $scope.paging1.currentPage,
                    pageSize: $scope.paging1.showRows,
                    feeType: 1
                }
            } else {
                opt = {
                    page: $scope.paging2.currentPage,
                    pageSize: $scope.paging2.showRows,
                    feeType: 2
                }
            }
            deliverFee.getDataTable({
                    param: {
                        query:opt
                    }
                }, '/deliverFee/queryDeliverFeeList')
                .then(function (data) {
                    if(i==0) {
                        if (data.code == -1) {
                            alert(data.message);
                            $scope.gridResult1 = [];
                            $scope.paging1 = {
                                totalPage: 1,
                                currentPage: 1,
                                showRows: $scope.paging1.showRows,
                            };
                            return false;
                        }
                        $scope.gridResult1 = data.grid;
                        $scope.paging1 = {
                            totalPage: data.total,
                            currentPage: $scope.paging1.currentPage,
                            showRows: $scope.paging1.showRows,
                        };
                    }else {
                        if (data.code == -1) {
                            alert(data.message);
                            $scope.gridResult2 = [];
                            $scope.paging2 = {
                                totalPage: 1,
                                currentPage: 1,
                                showRows: $scope.paging2.showRows,
                            };
                            return false;
                        }
                        $scope.gridResult2 = data.grid;
                        $scope.paging2 = {
                            totalPage: data.total,
                            currentPage: $scope.paging2.currentPage,
                            showRows: $scope.paging2.showRows,
                        };
                    }
                });
        }
        getGrid(0);
        $scope.goToPage = function (i) {
            getGrid(i);
        }
    }])
})