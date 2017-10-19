/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app', '../../../services/platform/customer-manage/customerAccountService'], function (app) {
     var app = angular.module('app');
    app.controller('customerAccountCtrl', ['$scope', '$sce','$window','$stateParams','customerAccount', function ($scope, $sce,$window,$stateParams,customerAccount) {
        $scope.customerName='';
        var customerId=0;
        //查询配置 注意(查询返回对象必须设置为$scope.searchModel)
        $scope.querySeting = {
            items: [
                {type: 'text', model: 'customerName', title: '客户名称'}
            ],
            btns: [
                {text: $sce.trustAsHtml('查询'), click: 'searchClick'}]
        };

        //table头
        $scope.thHeader = customerAccount.getThead();
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
        //日志分页下拉框
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
        //var pmsSearch = customerAccount.getSearch();
        //pmsSearch.then(function (data) {
        //    $scope.searchModel = data.query;//设置当前作用域的查询对象
        //
        //
        //    //获取table数据
        //    get();
        //}, function (error) {
        //    console.log(error)
        //});

        //查询
        $scope.searchClick = function () {
            //设置默认第一页

            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get();
        }
        //任务类型 下拉框change
        $scope.orderTypeIdChange = function () {
            //console.log($scope.searchModel.orderTypeIdSelect)
        }
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
			// console.log($scope.customerName)
			opts.id = $stateParams['id'];
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = customerAccount.getDataTable({param: {query: opts}});
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
                customerId=data.query.customerId;
                $scope.customerName = data.query.customerName;
                $scope.result = data.grid;
                //重置paging 解决分页指令不能监听对象问题
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function (error) {
                console.log(error);
            });
        }
        	$scope.isAccountChecked=true;
//        //初始化客户数据
//        customerAccount.getDataTable({param: {}}, '/customer/getCustomerList')
//            .then(function (data) {
//                $scope.customSelect.select = data.query.customerList;
//                $scope.customSelect.select.splice(0, 0, {id: -1, name: '请选择'})
//            }, function (error) {
//                console.log(error);
//            });
        //添加客户model
        $scope.addCustomModel = {
            userType: 5,//5:客户类型账号
            customerId: customerId,
            userName: '',
            tel: '',
            userPosition: '',
            account: '',
            password: ''
        };
//        $scope.customSelect = {
//            select: [],
//            id: -1
//        }
        var customID = 0;
        $scope.addCustomTitle = '添加客户管理账号';
        //添加按钮
        $scope.btnAddClick = function () {
            $scope.addCustomTitle = '添加客户管理账号';
            $scope.isAccountChecked=true;
            $scope.addCustomModel = {
                userType: 5,
                customerId: customerId,
                userName: '',
                tel: '',
                userPosition: '',
                account: '',
            };
//            $scope.customSelect.id = -1;
        }
        //修改
        $scope.updateCustom = function (i, item) {
        	$scope.isAccountChecked=false;
            $scope.addCustomTitle = '修改客户管理账号';
            customerAccount.getDataTable({param: {query: {id: item.id}}}, '/comUser/initUpdateUserInfoNew')
                .then(function (data) {
                    $scope.addCustomModel = {
                        id: data.query.id,
                        userType: 5,
                        customerId: data.query.customerId,
                        userName: data.query.userName,
                        tel: data.query.tel,
                        userPosition: data.query.userPosition,
                        account: data.query.account,
                        password: data.query.password
                    };
                   // $scope.customSelect.id = data.query.customerId;
                }, function (error) {
                    console.log(error);
                });

        }
        // 重置密码
        $scope.resetPassword = function(index, item){
        	customerAccount.getDataTable({param:{query:{id:item.id}}},'/userInfo/initUserInfoPassword').then(function(data){
                alert(data.status.msg);
            })
        }
     // 冻结账号
        $scope.frozen = function(index, item){
        	customerAccount.getDataTable({param:{query:{id:item.id,status:0}}},'/userInfo/lockUserInfo').then(function(data){
                alert(data.status.msg);
                if(data.status.code == "0000"){
                	 get();
                }
                alert(data.status.msg);
            })
        }
        // 恢复账号
        $scope.recovery = function(index, item){
        	customerAccount.getDataTable({param:{query:{id:item.id,status:2}}},'/userInfo/lockUserInfo').then(function(data){
                alert(data.status.msg);
                if(data.status.code == "0000"){
                	 get();
                }
                alert(data.status.msg);
            })
        }
        //提交按钮
        $scope.enterAdd = function () {
//            if ($scope.customSelect.id == -1) {
//                alert('请选择客户!');
//                return;
//            }
        	
        	
           // $scope.addCustomModel.customerId = $scope.customSelect.id;
            customerAccount.getDataTable({param: {query: $scope.addCustomModel}},
                $scope.addCustomTitle == '添加客户管理账号' ? '/comUser/insertUserInfoNew' : '/comUser/updateUserInfoNew')
                .then(function (data) {
                    if(data.status.code == "0000"){
                        get();
                        $('#addCustomerModal').modal('hide');
                    }
                    alert(data.status.msg);
                }, function (error) {
                    console.log(error);
                });
        }
        
      //返回
        $scope.back= function () {
            $window.history.back();
        }
        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        get();
    }]);
});