/**
 * Created by xuwusheng on 15/11/13.
 */
'use strict';
define(['./app'], function (app) {

    //配置路由
    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider','$ocLazyLoadProvider',function ($stateProvider, $urlRouterProvider, $httpProvider,$ocLazyLoadProvider) {


        //注册用户拦截器
        $httpProvider.interceptors.push('UserInterceptor');
        // 使用jquery的请求头 x-www-form-urlencoded
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


        /**
         * 将对象序列化 x-www-form-urlencoded.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '',
                name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };
        $ocLazyLoadProvider.config({
            loadedModules: ['app'],
            asyncLoader: require
        });

        // 重写默认请求
        $httpProvider.defaults.transformRequest = [function (data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
        $stateProvider
            .state('main', {
                url: '/main',
                abstract: true,
                lazyModule: 'app',
                lazyFiles: './controllers/mainCtrl',
                templateUrl: 'views/main.html',
                controller: 'mainCtrl'
            })
            .state('main.home', {
                url: '/home',
                lazyModule: 'app',
                lazyFiles: './controllers/homeCtrl',
                templateUrl: 'views/home.html',
                controller: 'homeCtrl'
            })
            .state('login', {
                url: '/login',
                lazyModule: 'app',
                lazyFiles: './controllers/loginCtrl',
                templateUrl: 'views/login.html',
                params: {'from': null, 'msg': null},
                controller: 'loginCtrl'
            })
            // 下拉菜单 --路由
            .state('select', {
                url: '/select',
                templateUrl: 'views/select.html',
                controller: 'selectCtrl'
            })
            //仓储-收货入库
            .state('main.takegoods', {
                url: '/takegoods',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage/takeGoodsTaskCtrl',
                templateUrl: 'views/storage/storage/takegoodstask.html?r=' + Math.random(),
                controller: 'TakeGoodsCtrl'

            })
            //收货确认
            .state('main.checkstorage', {
                url: '/checkstorage/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage/checkStorageCtrl',
                templateUrl: 'views/storage/storage/checkStorage.html?r=' + Math.random(),
                controller: 'CheckStorageCtrl'

            })
            //明细确认
            .state('main.takegoodsconfirm', {
                url: '/takegoodsconfirm/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage/takegoodsConfirmCtrl',
                templateUrl: 'views/storage/storage/takegoodsConfirm.html?r=' + Math.random(),
                controller: 'takegoodsConfirmCtrl'
            })
            //cdc-仓储-收货入库
            .state('main.inGoodsOrderList', {
                url: '/inGoodsOrderList',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage/cdctakeGoodsTaskCtrl',
                templateUrl: 'views/storage/storage/cdctakegoodstask.html?r=' + Math.random(),
                controller: 'cdcTakeGoodsCtrl'

            })
            //cdc-收货确认
            .state('main.cdccheckstorage', {
                url: '/cdccheckstorage/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage/cdccheckStorageCtrl',
                templateUrl: 'views/storage/storage/cdccheckStorage.html?r=' + Math.random(),
                controller: 'cdccheckStorageCtrl'

            })
            //cdc-收货查看
            .state('main.cdctakegoodsconfirm', {
                url: '/cdctakegoodsconfirm/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage/cdctakegoodsConfirmCtrl',
                templateUrl: 'views/storage/storage/cdctakegoodsConfirm.html?r=' + Math.random(),
                controller: 'cdctakegoodsConfirmCtrl'
            })
            // cdc-订单回执
            .state('main.cdcOrderReceipt', {
                url: '/cdcOrderReceipt',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/orderReceipt/cdcOrderReceiptCtrl',
                templateUrl: 'views/storage/orderReceipt/cdcOrderReceipt.html?param=' + Math.random(),
                controller: 'cdcOrderReceiptCtrl'
            })
            // cdc-回执确认
            .state('main.cdcOrderReceiptConfirm', {
                url: '/cdcOrderReceiptConfirm/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/orderReceipt/cdcOrderReceiptConfirmCtrl',
                templateUrl: 'views/storage/orderReceipt/cdcOrderReceiptConfirm.html?param=' + Math.random(),
                controller: 'cdcOrderReceiptConfirmCtrl'
            })
            // cdc-回执查看
            .state('main.cdcOrderReceiptLook', {
                url: '/cdcOrderReceiptLook/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/orderReceipt/cdcOrderReceiptLookCtrl',
                templateUrl: 'views/storage/orderReceipt/cdcOrderReceiptLook.html?param=' + Math.random(),
                controller: 'cdcOrderReceiptLookCtrl'
            })
            // cdc-出库单管理FDC
            .state('main.fsOutGoodsOrderManage', {
                url: '/fsOutGoodsOrderManage',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/order-qutbound/fsOutGoodsOrderManageCtrl',
                templateUrl: 'views/storage/order-qutbound/fsOutGoodsOrderManage.html?param=' + Math.random(),
                controller: 'fsOutGoodsOrderManageCtrl'
            })
            // cdc-订单出库
            .state('main.cdcOrderOutbound', {
                url: '/cdcOrderOutbound',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/order-qutbound/cdcOrderOutboundCtrl',
                templateUrl: 'views/storage/order-qutbound/cdc-order-qutbound.html?param=' + Math.random(),
                controller: 'cdcOrderOutboundCtrl'
            })
            // cdc-订单出库确认
            .state('main.cdcOrderOutboundConfirm', {
                url: '/cdcOrderOutboundConfirm/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/order-qutbound/cdcOrderOutboundConfirmCtrl',
                templateUrl: 'views/storage/order-qutbound/cdc-order-outbound-confirm.html?param=' + Math.random(),
                controller: 'cdcOrderOutboundConfirmCtrl'
            })

            // cdc-订单出库查看
            .state('main.cdcOrderOutboundLook', {
                url: '/cdcOrderOutboundLook/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/order-qutbound/cdcOrderOutboundLookCtrl',
                templateUrl: 'views/storage/order-qutbound/cdc-order-outbound-look.html?param=' + Math.random(),
                controller: 'cdcOrderOutboundLookCtrl'
            })
            // cdc-订单查询
            .state('main.cdcOrderSearch', {
                url: '/cdcOrderSearch',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/order-search/cdcorderSearchCtrl',
                templateUrl: 'views/storage/order-search/cdcorderSearch.html?param=' + Math.random(),
                controller: 'cdcorderSearchCtrl'
            })
            // cdc-补货查看FDC
            .state('main.fsBhView', {
                url: '/fsBhView',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/order-search/fsBhViewCtrl',
                templateUrl: 'views/storage/order-search/fsBhView.html?param=' + Math.random(),
                controller: 'fsBhViewCtrl'
            })
            // cdc-仓储-车辆管理
            .state('main.storageCarManage', {
                url: '/storageCarManage',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage-permissionManage/storageCarManageCtrl',
                templateUrl: 'views/storage/storage-permissionManage/storageCarManage.html?param=' + Math.random(),
                controller: 'storageCarManageCtrl'
            })
            // 仓储-费用登记
            .state('main.storageCostRegistration', {
                url: '/storageCostRegistration',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage-permissionManage/registrationFeeCtrl',
                templateUrl: 'views/storage/storage-permissionManage/registrationFee.html?param=' + Math.random(),
                controller: 'registrationFeeCtrl'
            })
            // 仓储-设备管理
            .state('main.storageEquipmentManagement', {
                url: '/storageEquipmentManagement',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage-permissionManage/storageEquipmentManagementCtrl',
                templateUrl: 'views/storage/storage-permissionManage/storageEquipmentManagement.html?param=' + Math.random(),
                controller: 'storageEquipmentManagementCtrl'
            })
            // 平台-设备管理
            .state('main.platformEquipmentManagement', {
                url: '/platformEquipmentManagement',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/information/platformEquipmentManagementCtrl',
                templateUrl: 'views/platform/information/platformEquipmentManagement.html?param=' + Math.random(),
                controller: 'platformEquipmentManagementCtrl'
            })

            // cdc-平台-车辆管理
            .state('main.platformCarManage', {
                url: '/platformCarManage',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/information/platformCarManageCtrl',
                templateUrl: 'views/platform/information/platformCarManage.html?param=' + Math.random(),
                controller: 'platformCarManageCtrl'
            })
              // 平台-物流供应商管理
            .state('main.wlSupplierManage', {
                url: '/wlSupplierManage',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/information/wlSupplierManageCtrl',
                templateUrl: 'views/platform/information/wlSupplierManage.html?param=' + Math.random(),
                controller: 'wlSupplierManageCtrl'
            })
            // 商品上架 --路由
            .state('main.itemupshelf', {
                url: '/itemupshelf',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage/itemUpshelfCtrl',
                templateUrl: 'views/storage/storage/itemupshelf.html?c=' + Math.random(),
                controller: 'itemUpshelfCtrl'
            })
            // 上架确认 --路由
            .state('main.confirmation', {
                url: '/confirmation/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage/confirmationCtrl',
                templateUrl: 'views/storage/storage/confirmation.html',
                controller: 'confirmationCtrl'
            })
            // 上架查看 --路由
            .state('main.confirmationCheck', {
                url: '/confirmationCheck/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage/confirmationCheckCtrl',
                templateUrl: 'views/storage/storage/confirmationCheck.html?param=' + Math.random(),
                controller: 'confirmationCheckCtrl'
            })
            // 残次品上架 --路由
            .state('main.badUpshelf', {
                url: '/badUpshelf',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage/badUpshelfCtrl',
                templateUrl: 'views/storage/storage/badUpshelf.html?c=' + Math.random(),
                controller: 'badUpshelfCtrl'
            })
            // 残次品上架确认 --路由
            .state('main.badconfirmation', {
                url: '/badconfirmation/:taskId/:outFlag',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage/badconfirmationCtrl',
                templateUrl: 'views/storage/storage/badconfirmation.html',
                controller: 'badconfirmationCtrl'
            })
            // 残次品上架查看 --路由
            .state('main.badUpLook', {
                url: '/badUpLook/:taskId/:outFlag',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage/badUpLookCtrl',
                templateUrl: 'views/storage/storage/badUpLook.html?param=' + Math.random(),
                controller: 'badUpLookCtrl'
            })
            // 订单拣货 --路由
            .state('main.orderPicking', {
                url: '/orderPicking',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/picking-packaging/orderPickingCtrl',
                templateUrl: 'views/storage/picking-packaging/order-picking.html?param=' + Math.random(),
                controller: 'orderPickingCtrl'
            })
            // 拣货单查看
            .state('main.pickingBillsLook', {
                url: '/pickingBillsLook/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/picking-packaging/pickingBillsLookCtrl',
                templateUrl: 'views/storage/picking-packaging/picking-bills-look.html?param=' + Math.random(),
                controller: 'pickingBillsLookCtrl'
            })
            // 订单包装
            .state('main.packBusiness', {
                url: '/packBusiness',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/picking-packaging/packBusinessCtrl',
                templateUrl: 'views/storage/picking-packaging/pack-business.html?param=' + Math.random(),
                controller: 'packBusinessCtrl'
            })
            // 包装单查看
            .state('main.orderPack', {
                url: '/orderPack/:taskId?isBtnShow',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/picking-packaging/orderPackCtrl',
                templateUrl: 'views/storage/picking-packaging/order-pack.html?param=' + Math.random(),
                controller: 'orderPackCtrl'
            })
            // 订单出库
            .state('main.orderOutbound', {
                url: '/orderOutbound',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/order-qutbound/orderOutboundCtrl',
                templateUrl: 'views/storage/order-qutbound/order-qutbound.html?param=' + Math.random(),
                controller: 'orderOutboundCtrl'
            })
            // 订单出库确认
            .state('main.orderOutboundConfirm', {
                url: '/orderOutboundConfirm/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/order-qutbound/orderOutboundConfirmCtrl',
                templateUrl: 'views/storage/order-qutbound/order-outbound-confirm.html?param=' + Math.random(),
                controller: 'orderOutboundConfirmCtrl'
            })
            // 商品货位查询
            .state('main.goodsAlloQuery', {
                url: '/goodsAlloQuery',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/goods-allocation/goodsAlloQueryCtrl',
                templateUrl: 'views/storage/goods-allocation/goodsAlloQuery.html?param=' + Math.random(),
                controller: 'goodsAlloQueryCtrl'
            })
            //货位数据
            .state('main.goodsallodata', {
                url: '/goodsallodata',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/goods-allocation/goodsAlloCtrl',
                templateUrl: 'views/storage/goods-allocation/goodsAllo-data.html?r=' + Math.random(),
                controller: 'goodsAlloCtrl'
            })
            //默认货位设置
            .state('main.defaultGoodsAllo', {
                url: '/defaultGoodsAllo',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/goods-allocation/defaultGoodsAlloCtrl',
                templateUrl: 'views/storage/goods-allocation/defaultGoodsAllo.html?r=' + Math.random(),
                controller: 'defaultGoodsAlloCtrl'
            })
            // 库存查询
            .state('main.inventoryQuery', {
                url: '/inventoryQuery',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/inventoryQueryCtrl',
                templateUrl: 'views/storage/inventory-manage/inventory-query.html?param=' + Math.random(),
                controller: 'inventoryQueryCtrl'
            })
            // cdc-库存查询
            .state('main.cdcInventoryQuery', {
                url: '/cdcInventoryQuery',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/cdcInventoryQueryCtrl',
                templateUrl: 'views/storage/inventory-manage/cdc-inventory-query.html?param=' + Math.random(),
                controller: 'cdcInventoryQueryCtrl'
            })
            // 库存转移
            .state('main.stockTransfer', {
                url: '/stockTransfer',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/stockTransferCtrl',
                templateUrl: 'views/storage/inventory-manage/stockTransfer.html?param=' + Math.random(),
                controller: 'stockTransferCtrl'
            })
            // 库存转移申请
            .state('main.stockTransferApply', {
                url: '/stockTransferApply',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/stockTransferApplyCtrl',
                templateUrl: 'views/storage/inventory-manage/stockTransferApply.html?param=' + Math.random(),
                controller: 'stockTransferApplyCtrl'
            })
            // 库存转移查看
            .state('main.stockTransferLook', {
                url: '/stockTransferLook/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/stockTransferLookCtrl',
                templateUrl: 'views/storage/inventory-manage/stockTransferLook.html?param=' + Math.random(),
                controller: 'stockTransferLookCtrl'
            })
            // 收货差异管理
            .state('main.goodsDifferenceManage', {
                url: '/goodsDifferenceManage',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/goodsDifferenceManageCtrl',
                templateUrl: 'views/storage/inventory-manage/goodsDifferenceManage.html?param=' + Math.random(),
                controller: 'goodsDifferenceManageCtrl'
            })
            // 收货差异确认
            .state('main.collectDifferenceConfirm', {
                url: '/collectDifferenceConfirm/:taskId/:custTaskId/:checkCount',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/collectDifferenceConfirmCtrl',
                templateUrl: 'views/storage/inventory-manage/collectDifferenceConfirm.html?param=' + Math.random(),
                controller: 'collectDifferenceConfirmCtrl'
            })
            // 收货差异查看
            .state('main.goodsDifferenceLook', {
                url: '/goodsDifferenceLook/:taskId/:custTaskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/goodsDifferenceLookCtrl',
                templateUrl: 'views/storage/inventory-manage/goodsDifferenceLook.html?param=' + Math.random(),
                controller: 'goodsDifferenceLookCtrl'
            })
            // 发货差异
            .state('main.differenceConfirmation', {
                url: '/differenceConfirmation',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/differenceConfirmationCtrl',
                templateUrl: 'views/storage/inventory-manage/differenceConfirmation.html?param=' + Math.random(),
                controller: 'differenceConfirmationCtrl'
            })
            // 发货差异确认
            .state('main.differenceConfirm', {
                url: '/differenceConfirm/:taskId/:custTaskId/:checkCount',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/differenceConfirmCtrl',
                templateUrl: 'views/storage/inventory-manage/differenceConfirm.html?param=' + Math.random(),
                controller: 'differenceConfirmCtrl'
            })
            // 发货差异查看
            .state('main.differenceConfirmationLook', {
                url: '/differenceConfirmationLook/:taskId/:custTaskId/:checkCount',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/differenceConfirmationLookCtrl',
                templateUrl: 'views/storage/inventory-manage/differenceConfirmationLook.html?param=' + Math.random(),
                controller: 'differenceConfirmationLookCtrl'
            })
            // 盘点任务
            .state('main.inventoryTask', {
                url: '/inventoryTask',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/inventoryTaskCtrl',
                templateUrl: 'views/storage/inventory-manage/inventoryTask.html?param=' + Math.random(),
                controller: 'inventoryTaskCtrl'
            })
            // 新建盘点
            .state('main.addInventory', {
                url: '/addInventory',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/addInventoryCtrl',
                templateUrl: 'views/storage/inventory-manage/addInventory.html?param=' + Math.random(),
                controller: 'addInventoryCtrl'
            })
            // 盘点详情
            .state('main.inventoryDetails', {
                url: '/inventoryDetails/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/inventoryDetailsCtrl',
                templateUrl: 'views/storage/inventory-manage/inventoryDetails.html?param=' + Math.random(),
                controller: 'inventoryDetailsCtrl'
            })
            // 盘点录入
            .state('main.inventoryEntry', {
                url: '/inventoryEntry/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/inventoryEntryCtrl',
                templateUrl: 'views/storage/inventory-manage/inventoryEntry.html?param=' + Math.random(),
                controller: 'inventoryEntryCtrl'
            })
            // 承运方赔偿登记
            .state('main.carriagePayRegister', {
                url: '/carriagePayRegister',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/carriagePayRegisterCtrl',
                templateUrl: 'views/storage/inventory-manage/carriagePayRegister.html?param=' + Math.random(),
                controller: 'carriagePayRegisterCtrl'
            })
            // 新增赔偿登记
            .state('main.newPayRegister', {
                url: '/newPayRegister/:taskId/:recordId',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/inventory-manage/newPayRegisterCtrl',
                templateUrl: 'views/storage/inventory-manage/newPayRegister.html?param=' + Math.random(),
                controller: 'newPayRegisterCtrl'
            })
            // 仓储岗位管理
            .state('main.storageStationManage', {
                url: '/storageStationManage',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage-permissionManage/stationManageCtrl',
                templateUrl: 'views/storage/storage-permissionManage/stationManage.html?param=' + Math.random(),
                controller: 'stationManageCtrl'
            })
            // 仓储人员管理
            .state('main.personnelManage', {
                url: '/personnelManage',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage-permissionManage/personnelManageCtrl',
                templateUrl: 'views/storage/storage-permissionManage/personnelManage.html?param=' + Math.random(),
                controller: 'personnelManageCtrl'
            })
            // 仓储 权限管理 条码管理
            .state('main.barcodeInformation', {
                url: '/barcodeInformation',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/storage-permissionManage/barcodeInformationCtrl',
                templateUrl: 'views/storage/storage-permissionManage/barcodeInformation.html?param=' + Math.random(),
                controller: 'barcodeInformationCtrl'
            })
            // 订单查询
            .state('main.orderSearch', {
                url: '/orderSearch',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/order-search/orderSearchCtrl',
                templateUrl: 'views/storage/order-search/orderSearch.html?param=' + Math.random(),
                controller: 'orderSearchCtrl'
            })
            // 报损报溢
            .state('main.breakageTheOverflow', {
                url: '/breakageTheOverflow',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/breakage-TheOverflow/breakageTheOverflowCtrl',
                templateUrl: 'views/storage/breakage-TheOverflow/breakageTheOverflow.html?param=' + Math.random(),
                controller: 'breakageTheOverflowCtrl'
            })
            // 新建报损报溢
            .state('main.newBreakageTheOverflow', {
                url: '/newBreakageTheOverflow',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/breakage-TheOverflow/newBreakageTheOverflowCtrl',
                templateUrl: 'views/storage/breakage-TheOverflow/newBreakageTheOverflow.html?param=' + Math.random(),
                controller: 'newBreakageTheOverflowCtrl'
            })

            // 仓储 特殊出入库 内部出库
            .state('main.inSideChuOrder', {
                url: '/inSideChuOrder',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/specialStorage/inSideChuOrderCtrl',
                templateUrl: 'views/storage/specialStorage/inSideChuOrder.html?param=' + Math.random(),
                controller: 'inSideChuOrderCtrl'
            })
            // 仓储 特殊出入库 新建出库申请
            .state('main.newInSideChuOrder', {
                url: '/newInSideChuOrder',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/specialStorage/newInSideChuOrderCtrl',
                templateUrl: 'views/storage/specialStorage/newInSideChuOrder.html?param=' + Math.random(),
                controller: 'newInSideChuOrderCtrl'
            })
            // 仓储 特殊出入库 其他出入库
            .state('main.otherChuRuOrder', {
                url: '/otherChuRuOrder',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/specialStorage/otherChuRuOrderCtrl',
                templateUrl: 'views/storage/specialStorage/otherChuRuOrder.html?param=' + Math.random(),
                controller: 'otherChuRuOrderCtrl'
            })
            // 仓储 特殊出入库 发起入库申请
            .state('main.newOtherRuOrder', {
                url: '/newOtherRuOrder',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/specialStorage/newOtherRuOrderCtrl',
                templateUrl: 'views/storage/specialStorage/newOtherRuOrder.html?param=' + Math.random(),
                controller: 'newOtherRuOrderCtrl'
            })
            // 仓储 特殊出入库 发起出库申请
            .state('main.newOtherChuOrder', {
                url: '/newOtherChuOrder',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/specialStorage/newOtherChuOrderCtrl',
                templateUrl: 'views/storage/specialStorage/newOtherChuOrder.html?param=' + Math.random(),
                controller: 'newOtherChuOrderCtrl'
            })
            // 进销存报表
            .state('main.jxcReport', {
                url: '/jxcReport',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/finance/jxcReportCtrl',
                templateUrl: 'views/storage/finance/jxcReport.html?param=' + Math.random(),
                controller: 'jxcReportCtrl'
            })
            // 库存流水
            .state('main.stockFlow', {
                url: '/stockFlow',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/finance/stockFlowCtrl',
                templateUrl: 'views/storage/finance/stockFlow.html?param=' + Math.random(),
                controller: 'stockFlowCtrl'
            })
            // 内部出入库明细
            .state('main.insideInOutStock', {
                url: '/insideInOutStock',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/finance/insideInOutStockCtrl',
                templateUrl: 'views/storage/finance/insideInOutStock.html?param=' + Math.random(),
                controller: 'insideInOutStockCtrl'
            })
            // 调拨明细
            .state('main.cannibalizingDetail', {
                url: '/cannibalizingDetail',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/finance/cannibalizingDetailCtrl',
                templateUrl: 'views/storage/finance/cannibalizingDetail.html?param=' + Math.random(),
                controller: 'cannibalizingDetailCtrl'
            })
            // 毁损明细
            .state('main.destroyDetail', {
                url: '/destroyDetail',
                lazyModule: 'app',
                lazyFiles: './controllers/storage/finance/destroyDetailCtrl',
                templateUrl: 'views/storage/finance/destroyDetail.html?param=' + Math.random(),
                controller: 'destroyDetailCtrl'
            })

            // 平台系统 监控 商品监控
            .state('main.goodsMonitor', {
                url: '/goodsMonitor',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/monitor-manage/goodsMonitorCtrl',
                templateUrl: 'views/platform/monitor-manage/goodsMonitor.html?param=' + Math.random(),
                controller: 'goodsMonitorCtrl'
            })
            // 平台系统 监控 库存监控
            .state('main.stockMonitor', {
                url: '/stockMonitor',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/monitor-manage/stockMonitorCtrl',
                templateUrl: 'views/platform/monitor-manage/stockMonitor.html?param=' + Math.random(),
                controller: 'stockMonitorCtrl'
            })
            // 平台系统 监控 仓储任务监控
            .state('main.taskMonitor', {
                url: '/taskMonitor',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/monitor-manage/taskMonitorCtrl',
                templateUrl: 'views/platform/monitor-manage/taskMonitor.html?param=' + Math.random(),
                controller: 'taskMonitorCtrl'
            })
            // 平台系统 监控 物流任务监控
            .state('main.WlTaskDicLists', {
                url: '/WlTaskDicLists',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/monitor-manage/WlTaskDicListsCtrl',
                templateUrl: 'views/platform/monitor-manage/WlTaskDicLists.html?param=' + Math.random(),
                controller: 'WlTaskDicListsCtrl'
            })
            // 平台系统 监控 外单查询
            .state('main.personalMonitor', {
                url: '/personalMonitor',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/monitor-manage/personalMonitorCtrl',
                templateUrl: 'views/platform/monitor-manage/personalMonitor.html?param=' + Math.random(),
                controller: 'personalMonitorCtrl'
            })
            // 平台系统 结算管理 订单结算
            .state('main.orderSettle', {
                url: '/orderSettle',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/settle-accounts/orderSettleCtrl',
                templateUrl: 'views/platform/settle-accounts/orderSettle.html?param=' + Math.random(),
                controller: 'orderSettleCtrl'
            })
            // 平台系统 结算管理 配送结算
            .state('main.logisticsSettle', {
                url: '/logisticsSettle',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/settle-accounts/logisticsSettleCtrl',
                templateUrl: 'views/platform/settle-accounts/logisticsSettle.html?param=' + Math.random(),
                controller: 'logisticsSettleCtrl'
            })
            // 平台系统 结算管理 配送货款应付
            .state('main.payablePayment', {
                url: '/payablePayment',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/settle-accounts/payablePaymentCtrl',
                templateUrl: 'views/platform/settle-accounts/payablePayment.html?param=' + Math.random(),
                controller: 'payablePaymentCtrl'
            })
            // 平台系统 结算管理 收货差异管理
            .state('main.tackGoodsDifference', {
                url: '/tackGoodsDifference',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/settle-accounts/tackGoodsDifferenceCtrl',
                templateUrl: 'views/platform/settle-accounts/tackGoodsDifference.html?param=' + Math.random(),
                controller: 'tackGoodsDifferenceCtrl'
            })
            // 平台系统 结算管理 差异查看
            .state('main.differenceCheck', {
                url: '/differenceCheck/:taskId/:custTaskId/:checkCount',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/settle-accounts/differenceCheckCtrl',
                templateUrl: 'views/platform/settle-accounts/differenceCheck.html?param=' + Math.random(),
                controller: 'differenceCheckCtrl'
            })
            // 平台系统 结算管理 承运方赔偿审核
            .state('main.brokenSearch', {
                url: '/brokenSearch',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/settle-accounts/brokenSearchCtrl',
                templateUrl: 'views/platform/settle-accounts/brokenSearch.html?param=' + Math.random(),
                controller: 'brokenSearchCtrl'
            })



            // 平台系统 结算管理 物流货款应付
            .state('main.logisticsPayment', {
                url: '/logisticsPayment',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/settle-accounts/logisticsPaymentCtrl',
                templateUrl: 'views/platform/settle-accounts/logisticsPayment.html?param=' + Math.random(),
                controller: 'logisticsPaymentCtrl'
            })
            // 平台系统 结算管理 损溢结算
            .state('main.profitOrLossPay', {
                url: '/profitOrLossPay',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/settle-accounts/profitorLossPayCtrl',
                templateUrl: 'views/platform/settle-accounts/profitorLossPay.html?param=' + Math.random(),
                controller: 'profitorLossPayCtrl'
            })
            // 平台系统 结算管理 特殊出入库结算
            .state('main.examineBlaOutIn', {
                url: '/examineBlaOutIn',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/settle-accounts/examineBlaOutInCtrl',
                templateUrl: 'views/platform/settle-accounts/examineBlaOutIn.html?param=' + Math.random(),
                controller: 'examineBlaOutInCtrl'
            })
            // 平台系统 无人仓  新建无人仓
            .state('main.newUnmannedWarehouse', {
                url: '/newUnmannedWarehouse',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/newUnmannedWarehouse/newUnmannedWarehouseCtrl',
                templateUrl: 'views/platform/newUnmannedWarehouse/newUnmannedWarehouse.html?param=' + Math.random(),
                controller: 'newUnmannedWarehouseCtrl'
            })
            // 平台系统 无人仓管理  货位信息管理
            .state('main.locationInformation', {
                url: '/locationInformation',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/administrationUnmannedWarehouse/locationInformationCtrl',
                templateUrl: 'views/platform/administrationUnmannedWarehouse/locationInformation.html?param=' + Math.random(),
                controller: 'locationInformationCtrl'
            })
            // 平台系统 无人仓管理  商品货位管理
            .state('main.goodsLocationAdministration', {
                url: '/goodsLocationAdministration',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/administrationUnmannedWarehouse/goodsLocationAdministrationCtrl',
                templateUrl: 'views/platform/administrationUnmannedWarehouse/goodsLocationAdministration.html?param=' + Math.random(),
                controller: 'goodsLocationAdministrationCtrl'
            })
            // 平台系统 无人仓管理  无人仓商品管理
            .state('main.unmannedGoodsAdministration', {
                url: '/unmannedGoodsAdministration',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/administrationUnmannedWarehouse/unmannedGoodsAdministrationCtrl',
                templateUrl: 'views/platform/administrationUnmannedWarehouse/unmannedGoodsAdministration.html?param=' + Math.random(),
                controller: 'unmannedGoodsAdministrationCtrl'
            })
            // 平台系统 无人仓管理  添加商品确认
            .state('main.unmannedGoodsAdd', {
                url: '/unmannedGoodsAdd/:fsCode',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/administrationUnmannedWarehouse/unmannedGoodsAddCtrl',
                templateUrl: 'views/platform/administrationUnmannedWarehouse/unmannedGoodsAdd.html?param=' + Math.random(),
                controller: 'unmannedGoodsAddCtrl'
            })




            // 平台系统 地址分派 任务大厅
            .state('main.taskHall', {
                url: '/taskHall',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/address-dispatch/taskHallCtrl',
                templateUrl: 'views/platform/address-dispatch/taskHall.html?param=' + Math.random(),
                controller: 'taskHallCtrl'
            })
            // 平台系统 VMI取货分配
            .state('main.VMIDistribution', {
                url: '/VMIDistribution',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/task-hall/VMIDistributionCtrl',
                templateUrl: 'views/platform/task-hall/VMIDistribution.html?param=' + Math.random(),
                controller: 'VMIDistributionCtrl'
            })
            // 平台系统 客户管理 添加客户
            .state('main.addCustomer', {
                url: '/addCustomer',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/customer-manage/addCustomerCtrl',
                templateUrl: 'views/platform/customer-manage/addCustomer.html?param=' + Math.random(),
                controller: 'addCustomerCtrl'
            })
            // 平台系统 客户管理 客户账号管理
            .state('main.customerAccount', {
                url: '/customerAccount/:id',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/customer-manage/customerAccountCtrl',
                templateUrl: 'views/platform/customer-manage/customerAccount.html?param=' + Math.random(),
                controller: 'customerAccountCtrl'
            })
            // 平台系统 财务 调拨明细
            .state('main.platformCannibalizingDetail', {
                url: '/platformCannibalizingDetail',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/finance-reporting/cannibalizingDetailCtrl',
                templateUrl: 'views/platform/finance-reporting/cannibalizingDetail.html?param=' + Math.random(),
                controller: 'platformCannibalizingDetailCtrl'
            })
            // 平台系统 财务 损毁明细
            .state('main.platformDestroyDetail', {
                url: '/platformDestroyDetail',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/finance-reporting/destroyDetailCtrl',
                templateUrl: 'views/platform/finance-reporting/destroyDetail.html?param=' + Math.random(),
                controller: 'platformDestroyDetailCtrl'
            })
            // 平台系统 财务 内部出入库
            .state('main.platformInsideInOutStock', {
                url: '/platformInsideInOutStock',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/finance-reporting/insideInOutStockCtrl',
                templateUrl: 'views/platform/finance-reporting/insideInOutStock.html?param=' + Math.random(),
                controller: 'platformInsideInOutStockCtrl'
            })
            // 平台系统 财务 进销存
            .state('main.platformJxcReport', {
                url: '/platformJxcReport',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/finance-reporting/jxcReportCtrl',
                templateUrl: 'views/platform/finance-reporting/jxcReport.html?param=' + Math.random(),
                controller: 'platformJxcReportCtrl'
            })
            // 平台系统 财务 库存流水
            .state('main.platformStockFlow', {
                url: '/platformStockFlow',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/finance-reporting/stockFlowCtrl',
                templateUrl: 'views/platform/finance-reporting/stockFlow.html?param=' + Math.random(),
                controller: 'platformStockFlowCtrl'
            })
            // 平台系统 权限 人员管理
            .state('main.warehouseManage', {
                url: '/warehouseManage',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/permission-manage/warehouseManageCtrl',
                templateUrl: 'views/platform/permission-manage/warehouseManage.html?param=' + Math.random(),
                controller: 'warehouseManageCtrl'
            })
            // 平台系统 权限 仓库人员管理
            .state('main.platformPersonnelManage', {
                url: '/platformPersonnelManage',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/permission-manage/personnelManageCtrl',
                templateUrl: 'views/platform/permission-manage/personnelManage.html?param=' + Math.random(),
                controller: 'platformPersonnelManageCtrl'
            })
            // 平台系统 权限 岗位管理
            .state('main.platformStationManage', {
                url: '/platformStationManage',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/permission-manage/stationManageCtrl',
                templateUrl: 'views/platform/permission-manage/stationManage.html?param=' + Math.random(),
                controller: 'platformStationManageCtrl'
            })
            // 平台系统 权限 岗位管理
            .state('main.platformExitUser', {
                url: '/platformExitUser',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/permission-manage/platformExitUserCtrl',
                templateUrl: 'views/platform/permission-manage/platformExitUser.html?param=' + Math.random(),
                controller: 'platformExitUserCtrl'
            })


            // 平台系统 仓储账号管理
            .state('main.storageAccountManage', {
                url: '/storageAccountManage/:id',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/storage-logistics/storageAccountManageCtrl',
                templateUrl: 'views/platform/storage-logistics/storageAccountManage.html?param=' + Math.random(),
                controller: 'storageAccountManageCtrl'
            })
            // 平台系统 配送账号管理
            .state('main.logisticAccountManage', {
                url: '/logisticAccountManage/:id',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/storage-logistics/logisticAccountManageCtrl',
                templateUrl: 'views/platform/storage-logistics/logisticAccountManage.html?param=' + Math.random(),
                controller: 'logisticAccountManageCtrl'
            })
            // 平台系统 仓储物流管理 仓储物流添加
            .state('main.addStorageLogistics', {
                url: '/addStorageLogistics',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/storage-logistics/addStorageLogisticsCtrl',
                templateUrl: 'views/platform/storage-logistics/addStorageLogistics.html?param=' + Math.random(),
                controller: 'addStorageLogisticsCtrl'
            })
            // 平台系统 第三方承运商 承运商账号管理
            .state('main.carriageAccount', {
                url: '/carriageAccount',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/third-party/carriageAccountCtrl',
                templateUrl: 'views/platform/third-party/carriageAccount.html?param=' + Math.random(),
                controller: 'carriageAccountCtrl'
            })

            // 平台系统 基础信息 发货人信息
            .state('main.distributionUser1', {
                url: '/distributionUser1',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/information/distributionUser1Ctrl',
                templateUrl: 'views/platform/information/distributionUser1.html?param=' + Math.random(),
                controller: 'distributionUser1Ctrl'
            })
            // 平台系统 基础信息 费用审核
            .state('main.platformExpenseAudit', {
                url: '/platformExpenseAudit',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/information/platformExpenseAuditCtrl',
                templateUrl: 'views/platform/information/platformExpenseAudit.html?param=' + Math.random(),
                controller: 'platformExpenseAuditCtrl'
            })
            // 平台系统 基础信息 收件人信息
            .state('main.distributionUser2', {
                url: '/distributionUser2',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/information/distributionUser2Ctrl',
                templateUrl: 'views/platform/information/distributionUser2.html?param=' + Math.random(),
                controller: 'distributionUser2Ctrl'
            })
            // 平台系统 基础信息 收货点信息
            .state('main.receivingPoint', {
                url: '/receivingPoint',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/information/receivingPointCtrl',
                templateUrl: 'views/platform/information/receivingPoint.html?param=' + Math.random(),
                controller: 'receivingPointCtrl'
            })
            // 平台系统 基础信息 商品管理
            .state('main.goodsManage', {
                url: '/goodsManage',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/information/goodsManageCtrl',
                templateUrl: 'views/platform/information/goodsManage.html?param=' + Math.random(),
                controller: 'goodsManageCtrl'
            })
            // 平台系统 外单结算管理 收货点结算
            .state('main.recePointPay', {
                url: '/recePointPay',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/externalSingleManagement/recePointPayCtrl',
                templateUrl: 'views/platform/externalSingleManagement/recePointPay.html?param=' + Math.random(),
                controller: 'recePointPayCtrl'
            })
            // 平台系统 外单结算管理 配送点结算
            .state('main.distributionPointPay', {
                url: '/distributionPointPay',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/externalSingleManagement/distributionPointPayCtrl',
                templateUrl: 'views/platform/externalSingleManagement/distributionPointPay.html?param=' + Math.random(),
                controller: 'distributionPointPayCtrl'
            })
            // 平台系统 外单结算管理 发货方代收货款结算
            .state('main.deliveryPartyPay', {
                url: '/deliveryPartyPay',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/externalSingleManagement/deliveryPartyPayCtrl',
                templateUrl: 'views/platform/externalSingleManagement/deliveryPartyPay.html?param=' + Math.random(),
                controller: 'deliveryPartyPayCtrl'
            })
            // 平台系统 外单结算管理 发货方运费结算
            .state('main.shippedFreightPay', {
                url: '/shippedFreightPay',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/externalSingleManagement/shippedFreightPayCtrl',
                templateUrl: 'views/platform/externalSingleManagement/shippedFreightPay.html?param=' + Math.random(),
                controller: 'shippedFreightPayCtrl'
            })
            // 平台系统 外单结算管理 第三方运费结算
            .state('main.thirdPartyFreightPay', {
                url: '/thirdPartyFreightPay',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/externalSingleManagement/thirdPartyFreightPayCtrl',
                templateUrl: 'views/platform/externalSingleManagement/thirdPartyFreightPay.html?param=' + Math.random(),
                controller: 'thirdPartyFreightPayCtrl'
            })
            // 平台系统 库存转移审核 库存转移审核
            .state('main.confirmStockTransfer', {
                url: '/confirmStockTransfer',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/confirmStockTransfer/confirmStockTransferCtrl',
                templateUrl: 'views/platform/confirmStockTransfer/confirmStockTransfer.html?param=' + Math.random(),
                controller: 'confirmStockTransferCtrl'
            })
            // 平台系统 库存转移审核 审核确认
            .state('main.confirmStockTransferConfirm', {
                url: '/confirmStockTransferConfirm/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/confirmStockTransfer/confirmStockTransferConfirmCtrl',
                templateUrl: 'views/platform/confirmStockTransfer/confirmStockTransferConfirm.html?param=' + Math.random(),
                controller: 'confirmStockTransferConfirmCtrl'
            })
            // 平台系统 盘点审核 盘点审核
            .state('main.confirmInventOrder', {
                url: '/confirmInventOrder',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/confirmInventOrder/confirmInventOrderCtrl',
                templateUrl: 'views/platform/confirmInventOrder/confirmInventOrder.html?param=' + Math.random(),
                controller: 'confirmInventOrderCtrl'
            })
            // 平台系统 盘点审核 审核确认
            .state('main.confirmInventOrderConfirm', {
                url: '/confirmInventOrderConfirm/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/confirmInventOrder/confirmInventOrderConfirmCtrl',
                templateUrl: 'views/platform/confirmInventOrder/confirmInventOrderConfirm.html?param=' + Math.random(),
                controller: 'confirmInventOrderConfirmCtrl'
            })
            // 平台系统 盘点审核 外单修改审核
            .state('main.billUpdateAudit', {
                url: '/billUpdateAudit',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/confirmStockTransfer/billUpdateAuditCtrl',
                templateUrl: 'views/platform/confirmStockTransfer/billUpdateAudit.html?param=' + Math.random(),
                controller: 'billUpdateAuditCtrl'
            })
             // 物流-新建订单
            .state('main.createOrder', {
                url: '/createOrder',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/createOrder/createOrderCtrl',
                templateUrl: 'views/logistics/createOrder/createOrder.html?param=' + Math.random(),
                controller: 'createOrderCtrl'
            })
            // 物流-新建全车件订单
            .state('main.createVehiclePartsOrder', {
                url: '/createVehiclePartsOrder',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/createOrder/createVehiclePartsOrderCtrl',
                templateUrl: 'views/logistics/createOrder/createVehiclePartsOrder.html?param=' + Math.random(),
                controller: 'createVehiclePartsOrderCtrl'
            })
            // 物流-新建全车件订单-查看
            .state('main.createVehiclePartsOrderLook', {
                url: '/createVehiclePartsOrderLook/:taskId/:waybillId',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/createOrder/createVehiclePartsOrderLookCtrl',
                templateUrl: 'views/logistics/createOrder/createVehiclePartsOrderLook.html?param=' + Math.random(),
                controller: 'createVehiclePartsOrderLookCtrl'
            })
            // 物流-新建全车件订单-发货
            .state('main.createVehiclePartsOrderChu', {
                url: '/createVehiclePartsOrderChu/:taskId/:waybillId',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/createOrder/createVehiclePartsOrderChuCtrl',
                templateUrl: 'views/logistics/createOrder/createVehiclePartsOrderChu.html?param=' + Math.random(),
                controller: 'createVehiclePartsOrderChuCtrl'
            })
            // 物流-订单配送
            .state('main.orderShip', {
                url: '/orderShip',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/order-ship/deliverOrderCtrl',
                templateUrl: 'views/logistics/order-ship/deliverOrder.html?param=' + Math.random(),
                controller: 'deliverOrderCtrl'
            })
             // 物流-外单分派
            .state('main.orderAssign', {
                url: '/orderAssign',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/order-ship/orderAssignCtrl',
                templateUrl: 'views/logistics/order-ship/orderAssign.html?param=' + Math.random(),
                controller: 'orderAssignCtrl'
            })
            // 物流-外单分派确定
            .state('main.orderAssignConfirm', {
                url: '/orderAssignConfirm',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/order-ship/orderAssignConfirmCtrl',
                templateUrl: 'views/logistics/order-ship/orderAssignConfirm.html?param=' + Math.random(),
                controller: 'orderAssignConfirmCtrl'
            })
            // 物流-绑定快递单号
            .state('main.expressNumber', {
                url: '/expressNumber',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/order-ship/bindExpressNumberCtrl',
                templateUrl: 'views/logistics/order-ship/bind-expressNumber.html?param=' + Math.random(),
                controller: 'bindExpressNumberCtrl'
            })
            // 物流-补打发货单
            .state('main.fillPrintOrder', {
                url: '/fillPrintOrder',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/order-ship/fillPrintOrderCtrl',
                templateUrl: 'views/logistics/order-ship/fillPrintOrder.html?param=' + Math.random(),
                controller: 'fillPrintOrderCtrl'
            })
            // 物流-取货单打印
            .state('main.carrierNotePrint', {
                url: '/carrierNotePrint',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/carrierNotePrint/carrierNotePrintCtrl',
                templateUrl: 'views/logistics/carrierNotePrint/carrierNotePrint.html?param=' + Math.random(),
                controller: 'carrierNotePrintCtrl'
            })
            // 物流-拆车件取货
            .state('main.dismantleNotePrint', {
                url: '/dismantleNotePrint',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/dismantleNotePrint/dismantleNotePrintCtrl',
                templateUrl: 'views/logistics/dismantleNotePrint/dismantleNotePrint.html?param=' + Math.random(),
                controller: 'dismantleNotePrintCtrl'
            })
            // 物流-订单回执
            .state('main.orderReceipt', {
                url: '/orderReceipt',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/orderReceipt/receiptOrderCtrl',
                templateUrl: 'views/logistics/orderReceipt/receiptOrder.html?param=' + Math.random(),
                controller: 'receiptOrderCtrl'
            })
            // 物流-客户收货确认
            .state('main.customerReceivingConfirmation', {
                url: '/customerReceivingConfirmation',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/orderReceipt/customerReceivingConfirmationCtrl',
                templateUrl: 'views/logistics/orderReceipt/customerReceivingConfirmation.html?param=' + Math.random(),
                controller: 'customerReceivingConfirmationCtrl'
            })
               // 物流-外单回执
            .state('main.receiptPerOrder', {
                url: '/receiptPerOrder',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/orderReceipt/receiptPerOrderCtrl',
                templateUrl: 'views/logistics/orderReceipt/receiptPerOrder.html?param=' + Math.random(),
                controller: 'receiptPerOrderCtrl'
            })
            // 物流-外单修改
            .state('main.monadAmend', {
                url: '/monadAmend',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/orderReceipt/monadAmendCtrl',
                templateUrl: 'views/logistics/orderReceipt/monadAmend.html?param=' + Math.random(),
                controller: 'monadAmendCtrl'
            })
            // 物流-物流退货
            .state('main.logistiReturn', {
                url: '/logistiReturn',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/orderReceipt/logistiReturnCtrl',
                templateUrl: 'views/logistics/orderReceipt/logistiReturn.html?param=' + Math.random(),
                controller: 'logistiReturnCtrl'
            })
            // 物流-新建退货入库
            .state('main.newRreturnStorage', {
                url: '/newRreturnStorage',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/orderReceipt/newRreturnStorageCtrl',
                templateUrl: 'views/logistics/orderReceipt/newRreturnStorage.html?param=' + Math.random(),
                controller: 'newRreturnStorageCtrl'
            })
            // 物流-承运损毁登记列表
            .state('main.registerList', {
                url: '/registerList',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/registeredCarrier/registerListCtrl',
                templateUrl: 'views/logistics/registeredCarrier/registerList.html?param=' + Math.random(),
                controller: 'registerListCtrl'
            })
            // 物流-新建登记
            .state('main.newRegister', {
                url: '/newRegister',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/registeredCarrier/newRegisterCtrl',
                templateUrl: 'views/logistics/registeredCarrier/newRegister.html?param=' + Math.random(),
                controller: 'newRegisterCtrl'
            })
            // 物流-任务查询
            .state('main.taskManage', {
                url: '/taskManage',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/taskManage/taskQueryCtrl',
                templateUrl: 'views/logistics/taskManage/taskQuery.html?param=' + Math.random(),
                controller: 'taskManageCtrl'
            })
             // 物流-取货确认
            .state('main.taskGoods', {
                url: '/taskGoods',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/taskGoods/taskGoodsCtrl',
                templateUrl: 'views/logistics/taskGoods/taskGoods.html?param=' + Math.random(),
                controller: 'taskGoodsCtrl'
            })
            // 物流-物流管理
            .state('main.lineManage', {
                url: '/lineManage',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/lineManage/lineManageCtrl',
                templateUrl: 'views/logistics/lineManage/lineManage.html?param=' + Math.random(),
                controller: 'lineManageCtrl'
            })
            // 物流-车辆管理
            .state('main.carManage', {
                url: '/carManage',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/carManage/carManageCtrl',
                templateUrl: 'views/logistics/carManage/carManage.html?param=' + Math.random(),
                controller: 'carManageCtrl'
            })
            // 物流-承运方结算
            .state('main.carrierClearing', {
                url: '/carrierClearing',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/logisticsSettlement/carrierClearingCtrl',
                templateUrl: 'views/logistics/logisticsSettlement/carrierClearing.html?param=' + Math.random(),
                controller: 'carrierClearingCtrl'
            })
              // 物流-外部接单回执结算
            .state('main.personClearing', {
                url: '/personClearing',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/logisticsSettlement/personClearingCtrl',
                templateUrl: 'views/logistics/logisticsSettlement/personClearing.html?param=' + Math.random(),
                controller: 'personClearingCtrl'
            })
            // 物流-承运损毁审核
            .state('main.damageAudit', {
                url: '/damageAudit',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/logisticsSettlement/damageAuditCtrl',
                templateUrl: 'views/logistics/logisticsSettlement/damageAudit.html?param=' + Math.random(),
                controller: 'damageAuditCtrl'
            })
            // 物流-应付货款
            .state('main.paymentForGoods', {
                url: '/paymentForGoods',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/logisticsSettlement/paymentForGoodsCtrl',
                templateUrl: 'views/logistics/logisticsSettlement/payment-for-goods.html?param=' + Math.random(),
                controller: 'paymentForGoodsCtrl'
            })
            // 物流-岗位管理
            .state('main.lsStationManage', {
                url: '/lsStationManage',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/permissionSettings/ls-stationManageCtrl',
                templateUrl: 'views/logistics/permissionSettings/stationManage.html?param=' + Math.random(),
                controller: 'lsStationManageCtrl'
            })
            // 物流-人员管理
            .state('main.lsPersonnelManage', {
                url: '/lsPersonnelManage',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/permissionSettings/ls-personnelManageCtrl',
                templateUrl: 'views/logistics/permissionSettings/personnelManage.html?param=' + Math.random(),
                controller: 'lsPersonnelManageCtrl'
            })
            // 物流-岗位管理
            .state('main.lsCarriersManage', {
                url: '/lsCarriersManage',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/permissionSettings/ls-carriersManageCtrl',
                templateUrl: 'views/logistics/permissionSettings/carriersManage.html?param=' + Math.random(),
                controller: 'lsCarriersManageCtrl'
            })
            // vmi取货
            .state('main.vmiPick', {
                url: '/vmiPick',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/pickReplenish/vmiPickCtrl',
                templateUrl: 'views/logistics/pickReplenish/vmiPick.html?param=' + Math.random(),
                controller: 'vmiPickCtrl'
            })
              // 物流 基础信息 发货人信息
            .state('main.wlShipper', {
                url: '/wlShipper',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/information/wlShipperCtrl',
                templateUrl: 'views/logistics/information/wlShipper.html?param=' + Math.random(),
                controller: 'wlShipperCtrl'
            })
            // 物流 基础信息 收件人信息
            .state('main.wlConsigner', {
                url: '/wlConsigner',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/information/wlConsignerCtrl',
                templateUrl: 'views/logistics/information/wlConsigner.html?param=' + Math.random(),
                controller: 'wlConsignerCtrl'
            })
            // 物流 外单查询
            .state('main.personalQuery', {
                url: '/personalQuery',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/personalQuery/personalQueryCtrl',
                templateUrl: 'views/logistics/personalQuery/personalQuery.html?param=' + Math.random(),
                controller: 'personalQueryCtrl'
            })
            // 物流-个人业务
            .state('main.personalBusiness', {
                url: '/personalBusiness',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/personalBusiness/personalBusinessCtrl',
                templateUrl: 'views/logistics/personalBusiness/personalBusiness.html?param=' + Math.random(),
                controller: 'personalBusinessCtrl'
            })
            // 平台系统 结算管理 报损报溢审核
            .state('main.examineSunYi', {
                url: '/examineSunYi',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/applyReview/examineSunYiCtrl',
                templateUrl: 'views/platform/applyReview/examineSunYi.html?param=' + Math.random(),
                controller: 'examineSunYiCtrl'
            })
            // 平台系统 结算管理 报损报溢操作
            .state('main.examineSunYiOperate', {
                url: '/examineSunYiOperate/:taskId',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/applyReview/examineSunYiOperateCtrl',
                templateUrl: 'views/platform/applyReview/examineSunYiOperate.html?param=' + Math.random(),
                controller: 'examineSunYiOperateCtrl'
            })
            // 平台系统 结算管理 特殊出入库审核
            .state('main.examineOutIn', {
                url: '/examineOutIn',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/applyReview/examineOutInCtrl',
                templateUrl: 'views/platform/applyReview/examineOutIn.html?param=' + Math.random(),
                controller: 'examineOutInCtrl'
            })

              // vmi入库
            .state('main.deliverVmiOrder', {
                url: '/deliverVmiOrder',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/deliverVmiOrderCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/deliverVmiOrder.html?param=' + Math.random(),
                controller: 'deliverVmiOrderCtrl'
            })
               // 外单入库
            .state('main.personOrderInCk', {
                url: '/personOrderInCk',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/personOrderInCkCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/personOrderInCk.html?param=' + Math.random(),
                controller: 'personOrderInCkCtrl'
            })
            // 订单收货
            .state('main.orderReceiving', {
                url: '/orderReceiving',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/orderReceivingCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/orderReceiving.html?param=' + Math.random(),
                controller: 'orderReceivingCtrl'
            })
            //批量订单收货
            .state('main.orderReceivingBatck', {
                url: '/orderReceivingBatck',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/orderReceivingBatckCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/orderReceivingBatck.html?param=' + Math.random(),
                controller: 'orderReceivingBatckCtrl'
            })
            // 外单入库确认
            .state('main.orderStorage', {
                url: '/orderStorage',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/orderStorageCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/orderStorage.html?param=' + Math.random(),
                controller: 'orderStorageCtrl'
            })
               // 外单退货入库
            .state('main.refuseInCk', {
                url: '/refuseInCk',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/refuseInCkCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/refuseInCk.html?param=' + Math.random(),
                controller: 'refuseInCkCtrl'
            })   // 外单退货入库确认
            .state('main.refuseInCkConfirm', {
                url: '/refuseInCkConfirm',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/refuseInCkConfirmCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/refuseInCkConfirm.html?param=' + Math.random(),
                controller: 'refuseInCkConfirmCtrl'
            })
                // 分拨入库
            .state('main.deliverFbOrder', {
                url: '/deliverFbOrder',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/deliverFbOrderCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/deliverFbOrder.html?param=' + Math.random(),
                controller: 'deliverFbOrderCtrl'
            })
             // 拆车件入库
            .state('main.scarpCar', {
                url: '/scarpCar',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/scarpCarCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/scarpCar.html?param=' + Math.random(),
                controller: 'scarpCarCtrl'
            })
            // 配送入库
            .state('main.deliverPutStorage', {
                url: '/deliverPutStorage',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/deliverPutStorage.html?param=' + Math.random(),
                controller: 'deliverPutStorageCtrl'
            })
            // 配送分拨
            .state('main.fbDistribution', {
                url: '/fbDistribution',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/fbDistributionCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/fbDistribution.html?param=' + Math.random(),
                controller: 'fbDistributionCtrl'
            })
            // 订单发货
            .state('main.orderDeliver', {
                url: '/orderDeliver',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/orderDeliverCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/orderDeliver.html?param=' + Math.random(),
                controller: 'orderDeliverCtrl'
            })
            // 批量订单发货
            .state('main.orderDeliverBatch', {
                url: '/orderDeliverBatch',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/orderDeliverBatchCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/orderDeliverBatch.html?param=' + Math.random(),
                controller: 'orderDeliverBatchCtrl'
            })
              // 外单出库
            .state('main.personOrderOutCk', {
                url: '/personOrderOutCk',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/personOrderOutCk/personOrderOutCkCtrl',
                templateUrl: 'views/logistics/personOrderOutCk/personOrderOutCk.html?param=' + Math.random(),
                controller: 'personOrderOutCkCtrl'
            })
            // 外单出库确认
            .state('main.personOrderOutCkConfirm', {
                url: '/personOrderOutCkConfirm',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/personOrderOutCk/personOrderOutCkConfirmCtrl',
                templateUrl: 'views/logistics/personOrderOutCk/personOrderOutCkConfirm.html?param=' + Math.random(),
                controller: 'personOrderOutCkConfirmCtrl'
            })
              // 外单退货出库
            .state('main.refuseOrderOutCkConfirm', {
                url: '/refuseOrderOutCkConfirm',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/personOrderOutCk/refuseOrderOutCkConfirmCtrl',
                templateUrl: 'views/logistics/personOrderOutCk/refuseOrderOutCkConfirm.html?param=' + Math.random(),
                controller: 'refuseOrderOutCkConfirmCtrl'
            })
            // 外单退货出库
            .state('main.refuseOrderOutCk', {
                url: '/refuseOrderOutCk',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/personOrderOutCk/refuseOrderOutCkCtrl',
                templateUrl: 'views/logistics/personOrderOutCk/refuseOrderOutCk.html?param=' + Math.random(),
                controller: 'refuseOrderOutCkCtrl'
            })
            // 确认入库
            .state('main.deliverPutStorageEnter', {
                url: '/deliverPutStorageEnter/:taskIds',
                params:{fbTaskId:null},
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/deliverPutStorageEnterCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/deliverPutStorageEnter.html?param=' + Math.random(),
                controller: 'deliverPutStorageEnterCtrl'
            })
            // 配送分拨确认
            .state('main.deliverDispatchEnter', {
                url: '/deliverDispatchEnter/:taskIds/:wlDeptId/:flag',
                lazyModule: 'app',
                lazyFiles: './controllers/logistics/deliverPutStorageDispatchManage/deliverDispatchEnterCtrl',
                templateUrl: 'views/logistics/deliverPutStorageDispatchManage/deliverDispatchEnter.html?param=' + Math.random(),
                controller: 'deliverDispatchEnterCtrl'
            })
            // 账号管理
            .state('main.accountManger', {
                url: '/accountManger',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/storage-logistics/accountMangerCtrl',
                templateUrl: 'views/platform/storage-logistics/accountManger.html?param=' + Math.random(),
                controller: 'accountMangerCtrl'
            })
            //礼品管理
            .state('main.giftManage', {
                url: '/giftManage',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/integral-mall/giftManagementCtrl',
                templateUrl: 'views/platform/integral-mall/giftManagement.html?param=' + Math.random(),
                controller: 'giftManagementCtrl'
            })
            //礼品订单
            .state('main.giftOrders', {
                url: '/giftOrders',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/integral-mall/giftOrdersCtrl',
                templateUrl: 'views/platform/integral-mall/giftOrders.html?param=' + Math.random(),
                controller: 'giftOrdersCtrl'
            })
            //订单导入
            .state('main.ordeImport', {
                url: '/ordeImport',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/integral-mall/ordeImportCtrl',
                templateUrl: 'views/platform/integral-mall/ordeImport.html?param=' + Math.random(),
                controller: 'ordeImportCtrl'
            })
            //礼品补货
            .state('main.giftReplenishment', {
                url: '/giftReplenishment',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/integral-mall/giftReplenishmentCtrl',
                templateUrl: 'views/platform/integral-mall/giftReplenishment.html?param=' + Math.random(),
                controller: 'giftReplenishmentCtrl'
            })
            //补货礼品确认
            .state('main.giftReplenishmentConfirm', {
                url: '/giftReplenishmentConfirm',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/integral-mall/giftReplenishmentConfirmCtrl',
                templateUrl: 'views/platform/integral-mall/giftReplenishmentConfirm.html?param=' + Math.random(),
                controller: 'giftReplenishmentConfirmCtrl'
            })
            //礼品调拨
            .state('main.giftTransfers', {
                url: '/giftTransfers',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/integral-mall/giftTransfersCtrl',
                templateUrl: 'views/platform/integral-mall/giftTransfers.html?param=' + Math.random(),
                controller: 'giftTransfersCtrl'
            })
            //礼品调拨确认
            .state('main.giftTransfersConfirm', {
                url: '/giftTransfersConfirm',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/integral-mall/giftTransfersConfirmCtrl',
                templateUrl: 'views/platform/integral-mall/giftTransfersConfirm.html?param=' + Math.random(),
                controller: 'giftTransfersConfirmCtrl'
            })
            //省市内设置
            .state('main.provincesAndCitiesSet', {
                url: '/provincesAndCitiesSet',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/deliverFee-set/provincesAndCitiesSetCtrl',
                templateUrl: 'views/platform/deliverFee-set/provincesAndCitiesSet.html?param=' + Math.random(),
                controller: 'provincesAndCitiesSetCtrl'
            })
            // 跨省设置
            .state('main.deliverFee', {
                url: '/deliverFee',
                lazyModule: 'app',
                lazyFiles: './controllers/platform/deliverFee-set/deliverFeeCtrl',
                templateUrl: 'views/platform/deliverFee-set/deliverFee.html?param=' + Math.random(),
                controller: 'deliverFeeCtrl'
            })
        $urlRouterProvider.otherwise('/login');
    }]);
});