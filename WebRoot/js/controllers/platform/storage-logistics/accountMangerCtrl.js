/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app', '../../../services/platform/storage-logistics/accountMangerService', '../../../services/addressLinkageService'], function (app) {
     var app = angular.module('app');
    app.controller('accountMangerCtrl', ['$scope', '$sce', 'accountManger', 'HOST', 'addressLinkage', 'rdc2cdc', function ($scope, $sce, accountManger, HOST) {
        $scope.tabFlag = 0;
        $scope.confirmBtn = 0;
        // 分页下拉框
        $scope.pagingSelect = [{value: 5, text: 5}, {value: 10, text: 10, selected: true}, {value: 20, text: 20}];
        // 分页对象
        $scope.paging = {totalPage: 1, currentPage: 1, showRows: 10};
        $scope.paging1 = {totalPage: 1, currentPage: 1, showRows: 10};
        $scope.paging2 = {totalPage: 1, currentPage: 1, showRows: 10};
        $scope.paging3 = {totalPage: 1, currentPage: 1, showRows: 10};
        // 获取grid头
        $scope.gridThHeader = accountManger.getTheadFirst();
        // 默认展示仓储物流查询
        $scope.storageAndLogisticsState = true;
        // 初始化搜索条件表单
        $scope.queryForm = {
            SLckName: '',
            SLwlName: '',
            COcName: '',
            SckName: '',
            DwlName: ''
        };
        // 新建模态框radio button 默认选中仓促配送
        $scope.radioModel = 7;
        // 初始化表单
        initForm();
        function initForm() {
            $scope.forms = {
                userName: '',
                tel: '',
                userPosition: '',
                account: ''
            };
            initRdcList();
            getWlList();
            getSecondWlList();
            getChildOperate();
        }
        // 获取表格数据
        function getGridData(url, params,tabFlag) {
            accountManger.getDataTable(url, params).then(function (data) {
                $scope.showFlag = data.query.showPartyFlag;
                if (data.code == -1) {
                    alert(data.message);
                    return false;
                }
                $scope.gridResult = data.grid;
                if(tabFlag==0){
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                }else if(tabFlag==1){
                    $scope.paging1 = {
                        totalPage: data.total,
                        currentPage: $scope.paging1.currentPage,
                        showRows: $scope.paging1.showRows,
                    };
                }else if(tabFlag==2){
                    $scope.paging2 = {
                        totalPage: data.total,
                        currentPage: $scope.paging2.currentPage,
                        showRows: $scope.paging2.showRows,
                    };
                }else if(tabFlag==3){
                    $scope.paging3 = {
                        totalPage: data.total,
                        currentPage: $scope.paging3.currentPage,
                        showRows: $scope.paging3.showRows,
                    };
                }

            })
        };
        // 获取表格默认数据
        getGridData('/comUser/queryWmsandTmsAccountList', {
            param: {
                query: {
                    page: $scope.paging.currentPage,
                    pageSize: $scope.paging.showRows,
                    ckName: $scope.queryForm.SLckName,
                    wlDeptName: $scope.queryForm.SLwlName
                }
            }
        },0);

        
        var navChangeIndex = 0;
        // nav change event
        $scope.navChange = function (flag) {
            $scope.tabFlag = flag;
            navChangeIndex = flag;
            $('.nav li').eq(flag).addClass('active').siblings().removeClass('active')
            switch (flag) {
                case 0:
                    $scope.gridThHeader = accountManger.getTheadFirst();
                    initSearchState(true, false, false, false);
                    getGridData('/comUser/queryWmsandTmsAccountList', {
                        param: {
                            query: {
                                page: $scope.paging.currentPage,
                                pageSize: $scope.paging.showRows,
                                ckName: $scope.queryForm.SLckName,
                                wlDeptName: $scope.queryForm.SLwlName
                            }
                        }
                    },0);

                    break;
                case 1:
                    $scope.gridThHeader = accountManger.getTheadSecond();
                    initSearchState(false, true, false, false);
                    getGridData('/comUser/queryPartyAccountList', {
                        param: {
                            query: {
                                page: $scope.paging1.currentPage,
                                pageSize: $scope.paging1.showRows,
                                partyName: $scope.queryForm.COcName
                            }
                        }
                    },1);
                    break;
                case 2:
                    $scope.gridThHeader = accountManger.getTheadThird();
                    initSearchState(false, false, true, false);
                    getGridData('/comUser/queryWmsAccountList', {
                        param: {
                            query: {
                                page: $scope.paging2.currentPage,
                                pageSize: $scope.paging2.showRows,
                                ckName: $scope.queryForm.SckName
                            }
                        }
                    },2);
                    break;
                case 3:
                    $scope.gridThHeader = accountManger.getTheadFourth();
                    initSearchState(false, false, false, true);
                    getGridData('/comUser/queryTmsAccountList', {
                        param: {
                            query: {
                                page: $scope.paging3.currentPage,
                                pageSize: $scope.paging3.showRows,
                                wlDeptName: $scope.queryForm.DwlName
                            }
                        }
                    },3);
                    break;
            };
        };
        $scope.goToPage = function () {
            $scope.navChange(navChangeIndex);
        }
        $scope.goToPage1 = function () {
            $scope.navChange(navChangeIndex);
        }
        $scope.goToPage2 = function () {
            $scope.navChange(navChangeIndex);
        }
        $scope.goToPage3 = function () {
            $scope.navChange(navChangeIndex);
        }
        // 初始化每一项下的搜索条件
        function initSearchState(SLState, COState, SState, DState) {
            $scope.storageAndLogisticsState = SLState;
            $scope.childOperateState = COState;
            $scope.storageState = SState;
            $scope.distridbutionState = DState;
        };

        // 查询
        $scope.queryMethod = function (flag) {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            $scope.navChange(flag);
        };
        // 新增按钮
        $scope.addAccountNum = function (title) {
            $scope.addAccountNum.title = title;
            $('#createAccountNum').modal('show');
            // 初始化表单
            $scope.ckSelectModel="-1";
            $scope.ckSubSelectModel="-1";
            $scope.wlSelectVal = '';
            $scope.wlSubSelectVal='';
            initForm();
            $scope.confirmBtn = 0;
            $('input[type="radio"]').removeAttr('disabled');
            $('input[name="account"]').removeAttr('disabled');
        }
        // 默认显示第一个
        $scope.CWState = true;
        // 初始化每一项下的搜索条件
        function initCreateRadiosState(CWState, ZState, CState, WState) {
            $scope.CWState = CWState;
            $scope.ZState = ZState;
            $scope.CState = CState;
            $scope.WState = WState;
        };
        // 选中账号用于, 切换成对应内容
        $scope.changeState = function (flag) {
            switch (flag) {
                case 0:
                    initRdcList();
                    getWlList();
                    initCreateRadiosState(true, false, false, false)
                    break;
                case 1:
                    initCreateRadiosState(false, true, false, false)
                    break;
                case 2:
                    initRdcList();
                    initCreateRadiosState(false, false, true, false)
                    break;
                case 3:
                    initCreateRadiosState(false, false, false, true)
                    break;
            }
        }
        // 初始化RDC, CDC list
        function initRdcList() {
            // RDC
            accountManger.getDataTable('/CkBaseInfo/getRDCList', {}).then(function (data) {
                $scope.ckSelectVal = data.query.RDC;
                $scope.ckSelectModel = data.query.RDC[0].id;
            })
            // 二级仓库
            accountManger.getDataTable('/CkBaseInfo/getCRCByRDC', {param: {query: {RDC: -1}}}).then(function (data) {
                $scope.ckSubSelectVal = data.query.CDC;
                $scope.ckSubSelectModel = data.query.CDC[0].id;
                // console.log(data)
            })

        }

        // 第一个配送
        function getWlList() {
            // 配送一级
            accountManger.getDataTable('/wlDept/getWlDeptListByCKId', {param: {query: {owerckId: -1}}}).then(function (data) {
                // console.log(data)
                try {
                    $scope.wlSelectVal = data.query.wlDeptList;
                    $scope.wlSelectModel = '';
                } catch (e) {
                }
            })
            // 配送二级
            accountManger.getDataTable('/wlDept/getWlDeptListByCKId', {param: {query: {owerckId: -1}}}).then(function (data) {
                try {
                    $scope.wlSubSelectVal = data.query.wlDeptList;
                    $scope.wlSubSelectModel = '';
                } catch (e) {
                }
            })
        }

        // 切换RDC获取数据
        $scope.getSubSelectData = function (sendId) {
            //  二级仓库
            accountManger.getDataTable('/CkBaseInfo/getCRCByRDC', {param: {query: {RDC: sendId}}}).then(function (data) {
                try {
                    $scope.ckSubSelectVal = data.query.CDC;
                    $scope.ckSubSelectModel = data.query.CDC[0].id;
                } catch (e) {
                }
            })
            // 配送一级
            accountManger.getDataTable('/wlDept/getWlDeptListByCKId', {param: {query: {owerckId: sendId}}}).then(function (data) {
                try {
                    if($scope.ckSelectModel === "-1"){
                        $scope.wlSelectVal = '';
                        $scope.wlSubSelectVal='';
                    }
                    $scope.wlSelectVal = data.query.wlDeptList;
                    $scope.wlSelectModel = data.query.wlDeptList[0].id;
                } catch (e) {
                }
            })
        }
        // 切换CDC获取 二级配送
        $scope.getWlSelectData = function (sendId) {
            // 配送二级
            accountManger.getDataTable('/wlDept/getWlDeptListByCKId', {param: {query: {owerckId: sendId}}}).then(function (data) {
                try {
                    if($scope.ckSubSelectModel === "-1"){
                        //$scope.wlSelectVal = '';
                        $scope.wlSubSelectVal='';
                    }
                    $scope.wlSubSelectVal = data.query.wlDeptList;
                    $scope.wlSubSelectModel = data.query.wlDeptList[0].id;
                } catch (e) {
                }
            })
        }
        // 获取子运营
        function getChildOperate() {
            accountManger.getDataTable('/party/getPartySelectList', {}).then(function (data) {
                try {
                    $scope.childOperateVal = data.query.party;
                    $scope.childOperateModel = data.query.party[0].id;
                } catch (e) {
                }
            })
        }

        // 第二个配送
        function getSecondWlList() {
            // 第二个配送一级
            accountManger.getDataTable('/wlDept/getWlDeptListByParentId', {param: {query: {parentId: 0}}}).then(function (data) {
                try {
                    $scope.wlSecondSelectVal = data.query.wlDeptList;
                    $scope.wlSecondSelectModel = data.query.wlDeptList[0].id;
                } catch (e) {
                }
            })
            // 第二个配送二级
            accountManger.getDataTable('/wlDept/getWlDeptListByParentId', {param: {query: {parentId: -1}}}).then(function (data) {
                try {
                $scope.wlSecondSubSelectVal = data.query.wlDeptList;
                $scope.wlSecondSubSelectModel = data.query.wlDeptList[0].id;
            }catch (e){}
            })
        }

        $scope.getWlSecondSubData = function (sendId) {
            // 第二个配送二级
            accountManger.getDataTable('/wlDept/getWlDeptListByParentId', {param: {query: {parentId: sendId}}}).then(function (data) {
                try {
                $scope.wlSecondSubSelectVal = data.query.wlDeptList;
                $scope.wlSecondSubSelectModel = data.query.wlDeptList[0].id;
            }catch (e){}
            })
        }
        // 重置密码
        $scope.resetPassword = function (index, item) {
            accountManger.getDataTable('/userInfo/initUserInfoPassword', {param: {query: {id: item.id}}}).then(function (data) {
                alert(data.status.msg);
                if (data.status.code =="0000") {
                    $scope.navChange($scope.tabFlag);
                }
            })
        }
        // 冻结账号
        $scope.frozen = function (index, item) {
            accountManger.getDataTable('/userInfo/lockUserInfo', {
                param: {
                    query: {
                        id: item.id,
                        status: 0
                    }
                }
            }).then(function (data) {
                alert(data.status.msg);
                if (data.status.code == "0000") {
                    $scope.navChange($scope.tabFlag);
                }
            })
        }
        // 恢复账号
        $scope.recovery = function (index, item) {
            accountManger.getDataTable('/userInfo/lockUserInfo', {
                param: {
                    query: {
                        id: item.id,
                        status: 2
                    }
                }
            }).then(function (data) {
                alert(data.status.msg);
                if (data.status.code == "0000") {
                    $scope.navChange($scope.tabFlag);
                }
            })
        }
        // 确认新增
        $scope.enterAdd = function () {
            var sendParams = {
                param: {
                    query: $scope.forms
                }
            }
            sendParams.param.query.rdcId = $scope.ckSelectModel;
            sendParams.param.query.cdcId = $scope.ckSubSelectModel;
            sendParams.param.query.rdcWlId = $scope.wlSelectModel;
            sendParams.param.query.cdcWlId = $scope.wlSubSelectModel;
            sendParams.param.query.partyId = $scope.childOperateModel;
            sendParams.param.query.userType = $scope.radioModel;
            if ($scope.radioModel == 2) {
                sendParams.param.query.rdcWlId = $scope.wlSecondSelectModel;
                sendParams.param.query.cdcWlId = $scope.wlSecondSubSelectModel;
            }

            if ($scope.confirmBtn == 0) {
                accountManger.getDataTable('/comUser/insertUserInfoNew', sendParams).then(function (data) {
                    alert(data.status.msg)
                    if (data.status.code == "0000") {
                        $('#createAccountNum').modal('hide');
                        $scope.navChange($scope.tabFlag);
                    }
                })
            } else {
                sendParams.param.query.id = $scope.modificationId;
                accountManger.getDataTable('/comUser/updateUserInfoNew', sendParams).then(function (data) {
                    // console.log(data)
                    alert(data.status.msg)
                    if (data.status.code  == "0000") {
                        $('#createAccountNum').modal('hide');
                        $scope.navChange($scope.tabFlag);
                    }
                })
            }
        }
        // 修改初始化
        $scope.modification = function (index, item) {
            $scope.addAccountNum.title = '编辑账号';
            $scope.modificationId = item.id
            $scope.confirmBtn = 1;
            $('input[type="radio"]').attr('disabled', 'disabled');
            $('input[name="account"]').attr('disabled', 'disabled');
            accountManger.getDataTable('/comUser/initUpdateUserInfoNew', {param: {query: {id: item.id}}}).then(function (data) {
                $('#createAccountNum').modal('show');
                $scope.forms = {
                    userName: data.query.userName,
                    tel: data.query.tel,
                    userPosition: data.query.userPosition,
                    account: data.query.account
                };
                $scope.radioModel = data.query.userType;
                if (data.query.userType == 7) {
                    initCreateRadiosState(true, false, false, false);
                    accountManger.getDataTable('/wlDept/getWlDeptListByCKId', {param: {query: {owerckId: data.query.rdcId}}}).then(function (result) {
                        // console.log(data)
                        try {
                            $scope.wlSelectVal = result.query.wlDeptList;
                            $scope.wlSelectModel = data.query.rdcWlId;
                        } catch (e) {
                        }
                    })
                    
                       // 配送二级
                 accountManger.getDataTable('/wlDept/getWlDeptListByCKId', {param: {query: {owerckId: data.query.cdcId}}}).then(function (result) {
                try {
                     $scope.wlSubSelectVal = result.query.wlDeptList;
                     $scope.wlSubSelectModel = data.query.cdcWlId;
                  } catch (e) {
                 }
              })
                    
                } else if (data.query.userType == 3) {
                    initCreateRadiosState(false, true, false, false);
                } else if (data.query.userType == 1) {
                    initCreateRadiosState(false, false, true, false);
                } else if (data.query.userType == 2) {
                    initCreateRadiosState(false, false, false, true);
                }

                //console.log(data.query)
                if (data.query.rdcId) {
                    $scope.ckSelectModel = data.query.rdcId;
                }
                if (data.query.cdcId) {
                    accountManger.getDataTable('/CkBaseInfo/getCRCByRDC', {param: {query: {RDC: data.query.rdcId}}}).then(function (result) {
                        $scope.ckSubSelectVal = result.query.CDC;
                        $scope.ckSubSelectModel = data.query.cdcId;
                    })
                    $scope.ckSubSelectModel = data.query.cdcId;
                }
                if (data.query.rdcWlId) {
                    $scope.wlSelectModel = data.query.rdcWlId;
                    $scope.wlSecondSelectModel = data.query.rdcWlId;

                }
                if (data.query.cdcWlId) {
                    accountManger.getDataTable('/wlDept/getWlDeptListByParentId', {param: {query: {parentId: data.query.rdcWlId}}}).then(function (result) {
                        $scope.wlSecondSubSelectVal = result.query.wlDeptList;
                        $scope.wlSecondSubSelectModel = data.query.cdcWlId;
                    })
                    $scope.wlSubSelectModel = data.query.cdcWlId;
                }
                if (data.query.partyId) {
                    $scope.childOperateModel = data.query.partyId;
                }

            })
        }
    }]);
});