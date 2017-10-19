/**
 * Created by xuwusheng on 15/11/13.
 */
requirejs.config({
    urlArgs: 'bust=v1.0.' + Math.random(),
    baseUrl: 'js',
    paths: {
        'angular': '../lib/angular',
        'ui-route': '../lib/angular-ui-router',
        'ng-cookie': '../lib/angular-cookies.min',
        'jquery': '../lib/jquery-1.11.3.min',
        'alert': '../lib/jquery-alert',
        'bootstrap-js': '../lib/bootstrap',
        'datePicker': '../lib/bootstrap-datepicker',
        'jquery-plugin': '../lib/jquery-plugin',
        'ng-fileUpload-shim': '../lib/ng-file-upload-shim.min',
        'ng-fileUpload': '../lib/ng-file-upload.min',
        'FileSaver': '../lib/FileSaver.min',
        'ocLazyLoad': '../lib/ocLazyLoad.require',
        'uiRouterDecorator': '../lib/angular-ui-router-decorator',
        'socket-io': '../lib/socket.io-1.7.3'
    },
    shim: {
        'jquery': {
            exports: 'jQuery'
        },
        'angular': {
            exports: 'angular'
        },
        'ui-route': ['angular'], //配置依赖关系
        'ng-cookie': ['angular'],
        'ng-fileUpload-shim': ['angular'],
        'ng-fileUpload': ['angular'],
        'jquery': ['angular'],
        'datePicker': ['jquery'],
        'alert': ['jquery'],
        'bootstrap-js': ['jquery'],
        'jquery-plugin': ['jquery'],
        'ocLazyLoad': ['angular']
    }
});


//引入 controller service directive
require([
    // 首页，登录
//    './controllers/homeCtrl',
//    './controllers/mainCtrl',
//    './controllers/loginCtrl',
    // 仓储  controller
   // './controllers/storage/storage/takeGoodsTaskCtrl',                      // 入库查询 - controller
    //'./controllers/storage/storage/checkStorageCtrl',                       // 验收入库 - controller
    './controllers/selectCtrl',                                             // 下拉菜单 - controller
    //'./controllers/storage/storage/itemUpshelfCtrl',                        // 商品上架 - controller
    //'./controllers/storage/storage/confirmationCtrl',                       // 上架确认 - controller
    //'./controllers/storage/storage/upshelflookoverCtrl',                    // 上架查看 - controller
    //'./controllers/storage/storage/confirmationCheckCtrl',                  // 上架查看 - controller
    //'./controllers/storage/storage/takegoodsConfirmCtrl',                   // 收货确认 - controller
    //'./controllers/storage/picking-packaging/orderPickingCtrl',             // 订单拣货 - controller
    //'./controllers/storage/picking-packaging/pickingBillsLookCtrl',         // 拣货单查看
    //'./controllers/storage/picking-packaging/packBusinessCtrl',             // 包装业务
    //'./controllers/storage/picking-packaging/orderPackCtrl',                // 订单包装
    //'./controllers/storage/order-qutbound/orderOutboundCtrl',               // 订单出库
    //'./controllers/storage/order-qutbound/orderOutboundConfirmCtrl',        // 订单出库确认
    //'./controllers/storage/inventory-manage/inventoryQueryCtrl',            // 库存查询
    //'./controllers/storage/goods-allocation/goodsAlloCtrl',                 // 货位数据 - controller
   // './controllers/storage/goods-allocation/defaultGoodsAlloCtrl',          // 默认货位 - controller
    //'./controllers/storage/inventory-manage/carriagePayRegisterCtrl',       // 承运方赔偿登记 - controller
    //'./controllers/storage/inventory-manage/newPayRegisterCtrl',            // 新增赔偿登记 - controller
    //'./controllers/storage/inventory-manage/goodsDifferenceManageCtrl',     // 收货差异管理 - controller
    //'./controllers/storage/inventory-manage/goodsDifferenceLookCtrl',       // 收货差异查看- controller
    //'./controllers/storage/inventory-manage/differenceConfirmCtrl',         // 差异确认- controller
    //'./controllers/storage/inventory-manage/differenceConfirmationCtrl',    // 发货差异确认 - controller
    //'./controllers/storage/inventory-manage/differenceConfirmationLookCtrl',       // 发货差异查看- controller
    //'./controllers/storage/storage-permissionManage/stationManageCtrl',     // 岗位管理 - controller
    //'./controllers/storage/storage-permissionManage/personnelManageCtrl',   // 人员管理 - controller
    //'./controllers/storage/order-search/orderSearchCtrl',                   // 订单查询 - controller
    //'./controllers/storage/finance/jxcReportCtrl',                          // 进销存报表 - controller
    //'./controllers/storage/finance/stockFlowCtrl',                          // 库存流水 - controller
    //'./controllers/storage/finance/insideInOutStockCtrl',                   // 内部出入库明细 - controller
    //'./controllers/storage/finance/cannibalizingDetailCtrl',                // 调拨明细 - controller
    //'./controllers/storage/finance/destroyDetailCtrl',                      // 毁损明细 - controller
    // 物流 controller
    //'./controllers/logistics/order-ship/deliverOrderCtrl',                     // 订单配送
    //'./controllers/logistics/order-ship/orderAssignCtrl',                     // 外单分派
    //'./controllers/logistics/order-ship/fillPrintOrderCtrl',                // 补打发货单
    //'./controllers/logistics/order-ship/bindExpressNumberCtrl',             // 绑定快递单号
    //'./controllers/logistics/carrierNotePrint/carrierNotePrintCtrl',        // 取货单打印
    //'./controllers/logistics/dismantleNotePrint/dismantleNotePrintCtrl',        // 拆车件取货打印
    //'./controllers/logistics/orderReceipt/receiptOrderCtrl',                // 订单回执
    //'./controllers/logistics/orderReceipt/receiptPerOrderCtrl',                // 外单回执
    //'./controllers/logistics/orderReceipt/logistiReturnCtrl',               // 物流退货
    //'./controllers/logistics/orderReceipt/newRreturnStorageCtrl',           // 新建物流退货单
    //'./controllers/logistics/registeredCarrier/registerListCtrl',           // 承运损毁登记列表
    //'./controllers/logistics/registeredCarrier/newRegisterCtrl',            // 新建赔偿登记
    //'./controllers/logistics/taskManage/taskQueryCtrl',                     // 任务查询
    //'./controllers/logistics/taskGoods/taskGoodsCtrl',                     // 取货确认
    //'./controllers/logistics/lineManage/lineManageCtrl',                    // 线路管理
    //'./controllers/logistics/carManage/carManageCtrl',                      // 车辆管理
    //'./controllers/logistics/logisticsSettlement/carrierClearingCtrl',      // 承运方结算
    //'./controllers/logistics/logisticsSettlement/personClearingCtrl',      // 外部接单回执结算
    //'./controllers/logistics/logisticsSettlement/damageAuditCtrl',          // 承运方结算
    //'./controllers/logistics/logisticsSettlement/paymentForGoodsCtrl',      // 应付货款
    //'./controllers/logistics/permissionSettings/ls-stationManageCtrl',      // 岗位管理
    //'./controllers/logistics/permissionSettings/ls-personnelManageCtrl',    // 人员管理
    //'./controllers/logistics/permissionSettings/ls-carriersManageCtrl',     // 人员管理
    //'./controllers/logistics/personalBusiness/personalBusinessCtrl',        // 物流-个人业务
    //'./controllers/platform/address-dispatch/taskHallCtrl',                 //平台系统 地址分派 任务大厅 - controller
    //'./controllers/platform/task-hall/VMIDistributionCtrl',                 //平台系统 地址分派 任务大厅 - controller
    //'./controllers/platform/customer-manage/addCustomerCtrl',               //平台系统 客户管理 添加客户 - controller
    //'./controllers/platform/customer-manage/customerAccountCtrl',           //平台系统 客户管理 客户账号管理 - controller
    //'./controllers/platform/finance-reporting/cannibalizingDetailCtrl',     //平台系统 财务 调拨明细 - controller
    //'./controllers/platform/finance-reporting/destroyDetailCtrl',           //平台系统 财务 损毁明细 - controller
    //'./controllers/platform/finance-reporting/insideInOutStockCtrl',        //平台系统 财务 内部出入库 - controller
    //'./controllers/platform/finance-reporting/jxcReportCtrl',               //平台系统 财务 进销存 - controller
    //'./controllers/platform/finance-reporting/stockFlowCtrl',               //平台系统 财务 库存流水 - controller
    //'./controllers/platform/monitor-manage/goodsMonitorCtrl',               //平台系统 监控 商品监控 - controller
    //'./controllers/platform/monitor-manage/stockMonitorCtrl',               //平台系统 监控 库存监控 - controller
    //'./controllers/platform/monitor-manage/taskMonitorCtrl',                //平台系统 监控 任务监控 - controller
    //'./controllers/platform/monitor-manage/WlTaskDicListsCtrl',             //平台系统 监控 任务监控 - controller
    //'./controllers/platform/monitor-manage/personalMonitorCtrl',             //平台系统 监控 外单查询 - controller
    //'./controllers/platform/permission-manage/personnelManageCtrl',         //平台系统 权限 人员管理 - controller
    //'./controllers/platform/permission-manage/stationManageCtrl',           //平台系统 权限 岗位管理 - controller
    //'./controllers/platform/settle-accounts/brokenSearchCtrl',              //平台系统 结算管理 承运方赔偿审核 - controller
    //'./controllers/platform/settle-accounts/logisticsPaymentCtrl',          //平台系统 结算管理 物流货款应付 - controller
    //'./controllers/platform/settle-accounts/logisticsSettleCtrl',           //平台系统 结算管理 物流结算 - controller
    //'./controllers/platform/settle-accounts/orderSettleCtrl',               //平台系统 结算管理 订单结算 - controller
    //'./controllers/platform/settle-accounts/payablePaymentCtrl',        //平台系统 结算管理 订单结算 - controller
    //'./controllers/platform/settle-accounts/tackGoodsDifferenceCtrl',       //平台系统 结算管理 收货差异管理 - controller
    //'./controllers/platform/settle-accounts/profitorLossPayCtrl',        //平台系统 结算管理 损溢结算 - controller
    //'./controllers/platform/settle-accounts/examineBlaOutInCtrl',        //平台系统 结算管理 特殊出入库结算 - controller
    //'./controllers/platform/applyReview/examineSunYiCtrl',        //平台系统 申请审核 报损报溢审核 - controller
    //'./controllers/platform/applyReview/examineSunYiOperateCtrl',        //平台系统 申请审核 报损报溢操作 - controller
    //'./controllers/platform/applyReview/examineOutInCtrl',        //平台系统 申请审核 特殊出入库审核 - controller




    './controllers/platform/storage-logistics/accountStorageLogisticCtrl',  //平台系统 仓储物流管理 仓储物流账号管理 - controller
    //'./controllers/platform/storage-logistics/storageAccountManageCtrl',    //平台系统 仓储物流管理 仓储物流账号管理 - controller
    //'./controllers/platform/storage-logistics/logisticAccountManageCtrl',   //平台系统 仓储物流管理 仓储物流账号管理 - controller
    //'./controllers/platform/storage-logistics/addStorageLogisticsCtrl',     //平台系统 仓储物流管理 仓储物流添加 - controller
    //'./controllers/platform/third-party/carriageAccountCtrl',               //平台系统 第三方承运商 承运商账号管理 - controller
    //'./controllers/platform/settle-accounts/differenceCheckCtrl',           //平台系统 第三方承运商 承运商账号管理 - controller
    //'./controllers/platform/information/distributionUser1Ctrl',           //平台系统 基础信息  发货人信息- controller
    //'./controllers/platform/information/distributionUser2Ctrl',           //平台系统 基础信息  收件人信息- controller
    //'./controllers/platform/information/receivingPointCtrl',           //平台系统 基础信息  收货点信息- controller
    //'./controllers/platform/externalSingleManagement/recePointPayCtrl',           //平台系统 外单结算管理 收货点结算- controller
    //'./controllers/platform/externalSingleManagement/distributionPointPayCtrl',           //平台系统 外单结算管理  配送点结算- controller
    //'./controllers/platform/externalSingleManagement/deliveryPartyPayCtrl',           //平台系统 外单结算管理  发货方代收货款结算- controller
    //'./controllers/platform/externalSingleManagement/shippedFreightPayCtrl',           //平台系统 外单结算管理  发货方运费结算- controller



    //'./controllers/storage/goods-allocation/goodsAlloQueryCtrl',            //商品货位查询 - controller
    //'./controllers/storage/inventory-stock/inventoryTaskCtrl',            //盘点任务 - controller
    //'./controllers/storage/inventory-stock/addInventoryCtrl',            //新建盘点 - controller
    //'./controllers/storage/inventory-stock/inventoryDetailsCtrl',            //盘点详情 - controller
    //'./controllers/storage/inventory-stock/inventoryEntryCtrl',            //盘点录入 - controller
    //'./controllers/storage/breakage-TheOverflow/breakageTheOverflowCtrl',            //报损报溢 - controller
    //'./controllers/storage/breakage-TheOverflow/newBreakageTheOverflowCtrl',            //新建报损报溢 - controller
    //'./controllers/storage/specialStorage/inSideChuOrderCtrl',            //仓储 特殊出入库 内部出库 - controller
    //'./controllers/storage/specialStorage/newInSideChuOrderCtrl',            //仓储 特殊出入库 新建出库申请 - controller
    //'./controllers/storage/specialStorage/otherChuRuOrderCtrl',            //仓储 特殊出入库 其他出入库 - controller
    //'./controllers/storage/specialStorage/newOtherRuOrderCtrl',            //仓储 特殊出入库 发起入库申请 - controller
    //'./controllers/storage/specialStorage/newOtherChuOrderCtrl',            //仓储 特殊出入库 发起出库申请 - controller


    //'./controllers/logistics/information/wlShipperCtrl',           //平台系统 基础信息  发货人信息- controller
    //'./controllers/logistics/information/wlConsignerCtrl',           //平台系统 基础信息  收件人信息- controller
    //'./controllers/logistics/createOrder/createOrderCtrl',                    //新建订单 - controller
//    './controllers/logistics/deliverPutStorageDispatchManage/deliverPutStorageCtrl',  //配送入库 - controller
    //'./controllers/logistics/pickReplenish/vmiPickCtrl',                    //vmi取货 - controller
    //'./controllers/logistics/deliverPutStorageDispatchManage/deliverVmiOrderCtrl',  //vmi入库 - controller
    //'./controllers/logistics/deliverPutStorageDispatchManage/personOrderInCkCtrl',  //外单入库 - controller
    //'./controllers/logistics/deliverPutStorageDispatchManage/refuseInCkCtrl',  //外单退货入库 - controller
    //'./controllers/logistics/deliverPutStorageDispatchManage/deliverFbOrderCtrl',  //分拨入库 - controller
    //'./controllers/logistics/deliverPutStorageDispatchManage/scarpCarCtrl',  //拆车件入库 - controller
    //'./controllers/logistics/deliverPutStorageDispatchManage/fbDistributionCtrl',  //配送分拨 - controller
    //'./controllers/logistics/deliverPutStorageDispatchManage/deliverDispatchEnterCtrl',  //配送分拨确认 - controller
    //'./controllers/logistics/deliverPutStorageDispatchManage/deliverPutStorageEnterCtrl',  //确认入库 - controller
    //'./controllers/logistics/personOrderOutCk/personOrderOutCkCtrl',  //确认入库 - controller
    //'./controllers/logistics/personOrderOutCk/refuseOrderOutCkCtrl',  //确认入库 - controller
    //'./controllers/logistics/deliverPutStorageDispatchManage/scarpCarCtrl',  //拆车件入库 - controller
    //'./controllers/platform/storage-logistics/accountMangerCtrl',           // 账号管理 - controller
    //'./controllers/platform/integral-mall/giftManagementCtrl',           // 礼品管理 - controller
    //'./controllers/platform/integral-mall/giftOrdersCtrl',           // 礼品订单 - controller
    //'./controllers/platform/integral-mall/ordeImportCtrl',           // 订单导入 - controller
    //'./controllers/platform/integral-mall/giftReplenishmentCtrl',           // 礼品补货 - controller
    //'./controllers/platform/integral-mall/giftReplenishmentConfirmCtrl',           // 补货礼品确认 - controller
    //'./controllers/platform/integral-mall/giftTransfersCtrl',           // 礼品调拨 - controller
    //'./controllers/platform/integral-mall/giftTransfersConfirmCtrl',           // 礼品调拨确认 - controller
    //'./controllers/platform/deliverFee-set/provincesAndCitiesSetCtrl',           // 省市内设置-controller
    //'./controllers/platform/deliverFee-set/deliverFeeCtrl',                 //跨省设置-controller


    // directive
    './directives/queryDirective',
    './directives/selectDirective',                                         // 下拉菜单 - Directive
    './directives/storageSelectDirective',                                  // 选择仓储下拉菜单 - Directive
    './directives/datePickerDirective',
    './directives/dataGridDirective',
    './directives/pagingDirective',
    './directives/menuDirective',                                           // 左侧菜单 - Directive
    './directives/topMenuDirective',                                        // 顶部菜单 - Directive
    './directives/goodsAllocationDirective',
    './directives/addressLinkageDirective',                                 // 省市级联 - Directive
    './directives/homeStyleDirective',					                    // 首页样式
    './directives/verifyDirective',                                         // 验证 - Directive
    './directives/verifyMessageDirective',
    './directives/exExcelDirective',                                        // 导出excel - Directive
    './directives/treeDirective',                                           // tree - Directive
    './directives/autocompleteDirective',                                           // autocomplete - Directive
    './directives/autofocusDirective',                                           // 自动获取焦点 - Directive
    './route',
    './main'
]);