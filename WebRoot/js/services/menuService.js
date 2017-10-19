/**
 * Created by xuwusheng on 15/12/15.
 */
'use strict';
define(['./appService'], function (service) {
	var service = angular.module('app.service');
    service.factory('menuService', ['$rootScope','$http', '$q', '$window', '$filter', function ($rootScope,$http, $q, $window, $filter) {
        var menuTree = [];
        return {
            getAll: function () {
                menuTree = menuTree.length > 0 ? menuTree : JSON.parse($window.localStorage.getItem('pl4MenuTree'))||[];
                return menuTree;
            },
            getTree: function (index) {
                if(menuTree.length==0)
                    this.getAll();
                if (menuTree.length - 1 >= index)
                    return menuTree[index];
                else
                    return [];
            },
            setTree: function (data) {
                menuTree = data;
                $window.localStorage.setItem('pl4MenuTree', $filter('json')(data));
                return menuTree;
            },
            removeTree: function () {
                $window.localStorage.removeItem('pl4MenuTree');
                menuTree=[];
                $rootScope.menuList=[];
            },
            getTreeByState: function (state) {
                this.getAll();
                var stateName = '#/' + state.name.replace('.', '/'),
                    isBreak = false,
                    _this=this;
                if (stateName != '#/main/home') {
                    $rootScope.isHomeHover=false;
                    angular.forEach(menuTree, function (item1,i) {
                        item1.change=false;
                        if (isBreak) return false;
                        angular.forEach(item1.menu, function (item2) {
                            item2.change=false;
                            if (isBreak) return false;
                            angular.forEach(item2.children, function (item3,k) {
                                item3.change=false;
                                if(isBreak) return false;
                                if (item3.url == stateName) {
                                    isBreak = true;
                                    $rootScope.menuList=_this.getTree(i).menu;
                                    // console.log($('.top-right>nav>div').removeClass('hover').find(i+1).html())
                                    //$('.top-right>nav>div').removeClass('hover').find(i+1).addClass('hover');
                                    item1.change=true;
                                    item2.change=true;
                                    item3.change=true;
                                    return false;
                                }
                            })
                        })
                    })

                }else {
                    $rootScope.isHomeHover=true;
                   // $rootScope.menuList=[];
                    //menuTree[0].change=true;
                }
            },
            //获取仓储 菜单
            getStorage: function () {
                return [{
                    name: '收货入库',
                    child: [{
                        name: '收货任务',
                        href: '#/main/takegoods'
                    }, {
                        name: '商品上架',
                        href: '#/main/itemupshelf'
                    }]
                }, {
                    name: '拣货包装',
                    child: [{
                        name: '订单拣货',
                        href: '#/main/orderPicking'
                    }, {
                        name: '订单包装',
                        href: '#/main/packBusiness'
                    }]
                }, {
                    name: '订单出库',
                    child: [{
                        name: '订单出库',
                        href: '#/main/orderOutbound'
                    }]
                }, {
                    name: '货位管理',
                    child: [{
                        name: '货位数据管理',
                        href: '#/main/goodsallodata'
                    }, {
                        name: '默认货位设置',
                        href: '#/main/defaultGoodsAllo'
                    }]
                }, {
                    name: '库存管理',
                    child: [{
                        name: '库存查询',
                        href: '#/main/inventoryQuery'
                    }, {
                        name: '承运方赔偿登记',
                        href: '#/main/carriagePayRegister'
                    }, {
                        name: '收货差异管理',
                        href: '#/main/goodsDifferenceManage'
                    }, {
                        name: '发货差异确认',
                        href: '#/main/differenceConfirmation'
                    }]
                }, {
                    name: '权限管理',
                    child: [{
                        name: '岗位管理',
                        href: '#/main/storageStationManage'
                    }, {
                        name: '人员管理',
                        href: '#/main/personnelManage'
                    }]
                }, {
                    name: '订单查询',
                    child: [{
                        name: '订单查询',
                        href: '#/main/orderSearch'
                    }]
                }, {
                    name: '仓储结算',
                    child: [{
                        name: '进销存报表',
                        href: '#/main/jxcReport'
                    }, {
                        name: '库存流水',
                        href: '#/main/stockFlow'
                    }, {
                        name: '内部出入库明细',
                        href: '#/main/insideInOutStock'
                    }, {
                        name: '调拨明细',
                        href: '#/main/cannibalizingDetail'
                    }, {
                        name: '毁损明细',
                        href: '#/main/destroyDetail'
                    }]
                }];
            },
            //获取物流菜单
            getLogistics: function () {
                return [
                    {
                        name: '任务大厅',
                        child: [{
                            name: '任务大厅',
                            href: '#/main/taskHall'
                        }]
                    }, {
                        name: '订单配送',
                        child: [{
                            name: '订单配送',
                            href: '#/main/orderShip'
                        }/*,{
                         name: '绑定快递单号',
                         href: '#/main/expressNumber'
                         }*/]
                    }, {
                        name: '取货/补货打印单',
                        child: [{
                            name: '取货/补货打印单查询',
                            href: '#/main/carrierNotePrint'
                        }]
                    }, {
                        name: '订单回执',
                        child: [{
                            name: '订单回执',
                            href: '#/main/orderReceipt'
                        }, {
                            name: '物流退货',
                            href: '#/main/logistiReturn'
                        }]
                    }, {
                        name: '承运损毁登记',
                        child: [{
                            name: '承运损毁登记',
                            href: '#/main/carriagePayRegister'
                        }]
                    }, {
                        name: '线路管理',
                        child: [{
                            name: '线路管理',
                            href: '#/main/lineManage'
                        }]
                    }, {
                        name: '车辆管理',
                        child: [{
                            name: '车辆管理',
                            href: '#/main/carManage'
                        }]
                    }, {
                        name: '物流任务管理',
                        child: [{
                            name: '任务管理',
                            href: '#/main/taskManage'
                        }]
                    }, {
                        name: '物流结算',
                        child: [{
                            name: '承运方结算',
                            href: '#/main/carrierClearing'
                        }, {
                            name: '应付货款',
                            href: '#/main/paymentForGoods'
                        }]
                    }, {
                        name: '权限管理',
                        child: [{
                            name: '岗位管理',
                            href: '#/main/lsStationManage'
                        }, {
                            name: '人员管理',
                            href: '#/main/lsPersonnelManage'
                        }, {
                            name: '承运商管理',
                            href: '#/main/lsCarriersManage'
                        }]
                    },
                ]
            },
            //获取平台数据
            getPlatform: function () {
                return [
                    {
                        name: '监控管理',
                        child: [{
                            name: '商品监控',
                            href: '#/main/goodsMonitor'
                        }, {
                            name: '库存监控',
                            href: '#/main/stockMonitor'
                        }, {
                            name: '任务监控',
                            href: '#/main/taskMonitor'
                        }]
                    }, {
                        name: '结算管理',
                        child: [{
                            name: '订单结算',
                            href: '#/main/orderSettle'
                        }, {
                            name: '物流结算',
                            href: '#/main/logisticsSettle'
                        }, {
                            name: '物流货款应付',
                            href: '#/main/logisticsPayment'
                        }, {
                            name: '收货差异管理',
                            href: '#/main/tackGoodsDifference'
                        }, {
                            name: '承运方赔偿审核',
                            href: '#/main/brokenSearch'
                        }]
                    }, {
                        name: '财务报表',
                        child: [{
                            name: '进销存',
                            href: '#/main/platformJxcReport'
                        }, {
                            name: '库存流水',
                            href: '#/main/platformStockFlow'
                        }, {
                            name: '内部出入库',
                            href: '#/main/platformInsideInOutStock'
                        }, {
                            name: '调拨明细',
                            href: '#/main/platformCannibalizingDetail'
                        }, {
                            name: '损毁明细',
                            href: '#/main/platformDestroyDetail'
                        }]
                    }, {
                        name: '仓储物流管理',
                        child: [{
                            name: '仓储物流添加',
                            href: '#/main/addStorageLogistics'
                        }, {
                            name: '仓储物流账号管理',
                            href: '#/main/accountStorageLogistic'
                        }]
                    }, {
                        name: '客户管理',
                        child: [{
                            name: '添加客户',
                            href: '#/main/addCustomer'
                        }, {
                            name: '客户账号管理',
                            href: '#/main/customerAccount'
                        }]
                    }, {
                        name: '第三方承运商管理',
                        child: [{
                            name: '承运商账号管理',
                            href: '#/main/carriageAccount'
                        }]
                    }, {
                        name: '地址分派',
                        child: [{
                            name: '任务大厅',
                            href: '#/main/taskHall'
                        }]
                    }, {
                        name: '权限管理',
                        child: [{
                            name: '岗位管理',
                            href: '#/main/platformStationManage'
                        }, {
                            name: '人员管理',
                            href: '#/main/platformPersonnelManage'
                        }]
                    }
                ]
            }
        };
    }]);
});