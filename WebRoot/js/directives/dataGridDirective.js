/**
 * Created by xuwusheng on 15/11/17.
 */
'use strict';
define(['../app'], function (app) {
    app.directive('pl4Grid', ['$state', '$timeout', function ($state, $timeout) {
        var dos = {};
        dos.checkEachAll = function (result, checked) {
            angular.forEach(result, function (item) {
                delete item.undefined;
                item.pl4GridCheckbox.checked = checked;
            });
        }
        dos.isCheckAll = function (result) {
            var ic = false;
            angular.forEach(result, function (item) {
                delete item.undefined;
                if (!item.pl4GridCheckbox.checked) {
                    ic = true;
                    return false;
                }
            });
            return ic;
        }
        dos.isEmptyObject= function (obj) {
            for(var key in obj)
                return true;
            return false;
        }
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                header: '=thHeader',
                result: '=gridTable',
                paging: '=paging',
                verify:'=verify'
            },
            templateUrl: 'views/grid.html?r=' + Math.random(),
            link: function (scope, el, attr) {
                scope.dataTable=[];
                var isWatched = false;
                scope.$watch('result', function () {
                    if (!scope.result) return;
                   // if (!isWatched)
                        pl4ResultInit();
                });
                var resultLensWatch = scope.$watch('result.length', function () {
                    if (!scope.result) return;
                        if (!isWatched)
                            pl4ResultInit();
                })

                scope.hasClassRed = function(val) {
                   // val = val + '';
                   // if (val.indexOf('-')>=0 || val === '盘亏') {
                   //     return true
                   // }
                    if (val === '盘亏') {
                        return true
                    }
                    return false
                }

                    function pl4ResultInit() {
                    scope.masterChecked = false;
                    isWatched = true;
                    $(el).find('tbody').css({opacity: 0, visibility: 'hidden'});
                    var itemListArrays = [], itemListArraysIndex = 0,//列内list数组
                        totalFields={};
                    //设置绑定checkbox、link
                    angular.forEach(scope.result, function (item, i) {
                        var link, linkLens, linkOpts, indexHead = 0,isTotal=[], selectedFields = [];
                        angular.forEach(scope.header, function (head, j) {
                            if (head.link && !head.click) {
                                indexHead = j;
                                link = head.link.url;
                            }
                            if(head.isTotal){
                                isTotal.push(head.field);
                            }
                        })
                        if (link && !linkLens)
                            linkLens = link.split('{').length - 1;
                        if (link && linkLens && !linkOpts) {
                            linkOpts = [];
                            var link2 = link;
                            for (var k = 0; k < linkLens; k++) {
                                var sl1 = link2.substring(link2.indexOf('{') + 1, link2.indexOf('}'));
                                link2 = link2.replace('{' + sl1 + '}', '');
                                linkOpts.push(sl1);
                            }
                            for (var k = 0; k < linkOpts.length; k++) {
                                link = link.replace('{' + linkOpts[k] + '}', item[linkOpts[k]]);
                            }
                            item['pl4GridLink' + indexHead] = link;
                        }
                        if(isTotal.length>0){
                            isTotal.forEach(function(total){
                                if(totalFields[total]){
                                    console.log(item)
                                    totalFields[total]+=parseFloat(item[total]);
                                }
                                else{
                                    //console.log(item)
                                    totalFields[total]=parseFloat(item[total]);
                                }
                            });
                        }
                        item['pl4GridCheckbox'] = {value: item.id, checked: false};
                        //设置列表插入
                        if (item.list) {
                            resultLensWatch();
                            var rowspan = 1, fields = '';
                            itemListArrays[itemListArraysIndex] = new Array();
                            angular.forEach(item.list, function (list, k) {
                                list['pl4RowspanCols'] = true;
                                itemListArrays[itemListArraysIndex].push({index: i + (k + 1), list: list});
                                //scope.result.splice(i+(k+1),0,list);
                                rowspan++;
                            });
                            //取出需要显示的列名
                            for (var key in item.list[0]) {
                                fields += key + ',';
                            }

                            item['pl4Rowspan'] = {rows: rowspan, field: fields};
                            itemListArraysIndex++;
                        }
                        //设置index
                        if (scope.paging)
                            item['pl4GridIndex'] = i + ((scope.paging.currentPage - 1) * scope.paging.showRows);
                        else
                            item['pl4GridIndex'] = i;
                    });
                    if(dos.isEmptyObject(totalFields)){
                        resultLensWatch();
                        var headers={'pl4Total':true};
                        angular.forEach(scope.header, function (head) {
                            if(head.type=='pl4GridCount')
                                headers['pl4GridIndex']='total';
                            if(head.total)
                                headers[head.field]=head.total;
                        });
                        headers = angular.extend({},headers,totalFields);
                        scope.result.push(headers);
                    }
                    var nextIndex = 0;
                    for (var i = 0; i < itemListArrays.length; i++) {
                        nextIndex += i - 1 >= 0 ? itemListArrays[i - 1].length : 0;
                        for (var k = 0; k < itemListArrays[i].length; k++) {
                            scope.result.splice(itemListArrays[i][k].index + (i - 1 >= 0 ? nextIndex : 0), 0, itemListArrays[i][k].list);
                        }
                    }
                    scope.dataTable=scope.result;
                    $timeout(function () {
                        //for (var i = 0; i < $(el).find('tbody tr').length; i++){
                        //    $(el).find('tbody tr').eq(i*2-1).css({
                        //        'background': '#f4f4f4'
                        //    })
                        //}
                        // console.log( )
                        $(el).find('tbody td span.pl4-dataBinding').each(function () {
                            $(this).css({'height': 'auto', 'display': 'inline', 'overflow': 'initial'});
                            if ($(this).height() > 42) {
                                $(this).css({'height': '42px', 'display': 'block', 'overflow': 'hidden'});
                                $(this).parent().addClass('pl4-grid-popover').append('<span class="table-ellipsis">...</span>');
                            } else {
                                $(this).parent().find('.table-ellipsis').remove();
                            }
                        });
                        //表超出显示事件
                        var $pl4GridPopover = $(el).find('.pl4-grid-popover'), popoverTimer, mouseenterTimer, $Popover = $('#pl4GridPopover');
                        $pl4GridPopover.unbind('mouseenter,mouseleave');
                        $pl4GridPopover.on('mouseenter', function () {
                            var $this = $(this);
                            mouseenterTimer = $timeout(function () {
                                $timeout.cancel(popoverTimer);
                                $Popover.find('.popover-title').text($this.attr('data-header'));
                                $Popover.find('.popover-content').text($this.attr('data-title'));
                                $Popover.css({
                                    left: ($this.offset().left + $this.width() + 10) + 'px',
                                    top: ($this.offset().top - 10) + 'px'
                                }).show();
                            }, 400);

                        }).on('mouseleave', function () {
                            $timeout.cancel(mouseenterTimer);
                            popoverTimer = $timeout(function () {
                                $Popover.hide();
                            }, 300);
                        });
                        $Popover.unbind('mouseenter,mouseleave');
                        $Popover.on('mouseenter', function () {
                            $timeout.cancel(popoverTimer);
                        }).on('mouseleave', function () {
                            $timeout.cancel(mouseenterTimer);
                            $(this).hide();
                        });

                        //显示数据
                        $(el).find('tbody').css('visibility', 'visible').animate({opacity: 1}, 200);//.css('opacity','1')//.css('visibility','visible');

                        isWatched = false;

                    }, 300);
                }

                //下拉框change事件
                scope.pl4GridSelectChange = function (i, j, head, item) {
                    if (head.selectChange && scope.$parent[head.selectChange] instanceof Function) {
                        scope.$parent[head.selectChange](i, item);
                    }
                }
                scope.masterChecked = false;
                //全选
                scope.checkAll = function () {
                    scope.masterChecked = !scope.masterChecked;
                    dos.checkEachAll(scope.result, scope.masterChecked);
                }
                //单选
                scope.check = function (ck) {
                    ck.checked = !ck.checked;
                    var ic = dos.isCheckAll(scope.result);
                    if (scope.masterChecked && ic)
                        scope.masterChecked = false;
                    else if (!ic)
                        scope.masterChecked = true;
                }
                //单列click 返回参数 行索引，列索引，行对象，列字段名
                scope.columnClick = function (i, j, item, colName, call) {
                    if (call && typeof scope.$parent[call] === 'function')
                        scope.$parent[call](i, j, item, colName, item);
                }
                //行按钮 后台返回按钮数据
                scope.gridRowsClickOp = function (index, item, btn, head) {
                    angular.forEach(head.buttons, function (hb) {
                        if (hb.text == btn.text) {
                            if (hb.btnType != 'link') {
                                if (typeof scope.$parent[hb.call] === 'function')
                                    scope.$parent[hb.call](index, item, btn);
                                if (hb.openModal)
                                    $(hb.openModal).modal();
                                return false;
                            } else {
                                var obj = {};
                                if (btn.param) {
                                    var _pLen = btn.param.split(',');
                                    for (var i = 0; i < _pLen.length; i++) {
                                        obj[_pLen[i]] = item[_pLen[i]];
                                    }
                                }
                                if(hb.isBtnShow){
                                    obj["isBtnShow"]=hb.isBtnShow;
                                }
                                //grid内跳转 统一将main页面设置模板页
                                $state.go('main.' + hb.state, obj);
                            }
                        }
                    });
                }
                //行按钮
                scope.gridRowsClick = function (index, btn, obj) {
                    if (typeof scope.$parent[btn.call] === 'function')
                        scope.$parent[btn.call](index, obj, btn);
                    if (btn.openModal)
                        $(btn.openModal).modal();
                }
                //判断是否验证框
                scope.isInputNum = function (head, item) {
                    try {
                        if (head.input && typeof item[head.field] === 'object' && item[head.field].type == 'num')
                            return true;
                        else
                            return false;

                    } catch (e) {
                        return false;
                    }
                }
                //验证inputNumber
                scope.verifyInputNum = function (head, itemIndex, index, item) {
                    var verifyRes = '';
                    if (head.verify) {
                        if (head.verify.min !== undefined) {
                            if (typeof head.verify.min != 'string') {
                                if (item[head.field] < head.verify.min) {
                                    verifyRes = head.name + '不能小于 ' + head.verify.min;
                                    item['input' + itemIndex + '-' + index] = true;
                                    //$('.input'+itemIndex+'-'+index).focus();
                                } else{
                                    item['input' + itemIndex + '-' + index] = false;

                                }
                                scope.verify= item['input' + itemIndex + '-' + index];
                            } else if (head.verify.min == 'field') {
                                if (item[head.field] < item[head.verify.field]) {
                                    verifyRes = head.name + '不能小于 ' + item[head.verify.field];
                                    item['input' + itemIndex + '-' + index] = true;
                                    //$('.input'+itemIndex+'-'+index).focus();
                                } else{
                                    item['input' + itemIndex + '-' + index] = false;

                                }
                                scope.verify= item['input' + itemIndex + '-' + index];
                            }
                        }
                        if (head.verify.max !== undefined) {
                            if (typeof head.verify.max != 'string') {
                                if (item[head.field] > head.verify.max) {
                                    verifyRes = head.name + '不能大于 ' + head.verify.max;
                                    item['input' + itemIndex + '-' + index] = true;
                                    //$('.input'+itemIndex+'-'+index).focus();
                                } else{
                                    item['input' + itemIndex + '-' + index] = false;

                                }
                                scope.verify= item['input' + itemIndex + '-' + index];
                            } else if (head.verify.max == 'field') {
                                if (item[head.field] > item[head.verify.field]) {
                                    verifyRes = head.name + '不能大于 ' + item[head.verify.field];
                                    item['input' + itemIndex + '-' + index] = true;
                                    //$('.input'+itemIndex+'-'+index).focus();
                                } else{
                                    item['input' + itemIndex + '-' + index] = false;

                                }
                                scope.verify= item['input' + itemIndex + '-' + index];
                            }
                        }
                        if (head.verify.eq !== undefined) {
                            if (typeof head.verify.eq != 'string') {
                                if (item[head.field] != head.verify.eq) {
                                    verifyRes = head.name + '不等于 ' + head.verify.eq;
                                    item['input' + itemIndex + '-' + index] = true;
                                    //$('.input'+itemIndex+'-'+index).focus();
                                }else{
                                    item['input' + itemIndex + '-' + index] = false;

                                }
                                scope.verify= item['input' + itemIndex + '-' + index];
                            } else if (head.verify.eq == 'field') {
                                if (item[head.field] != item[head.verify.field]) {
                                    verifyRes = head.name + '不等于 ' + item[head.verify.field];
                                    item['input' + itemIndex + '-' + index] = true;
                                    //$('.input'+itemIndex+'-'+index).focus();
                                }else{
                                    item['input' + itemIndex + '-' + index] = false;

                                }
                                scope.verify= item['input' + itemIndex + '-' + index];
                            }
                        }
                    }
                    if (verifyRes != '')
                        alert(verifyRes, function () {
                            $timeout(function () {
                                $('.input' + itemIndex + '-' + index).focus();
                            }, 300);
                        });
                    if (typeof scope.$parent[head.blur] === 'function')
                        scope.$parent[head.blur](item, itemIndex, index, verifyRes != '' ? false : true);//返回参数:item,当前行索引,当前列索引,验证结果,
                }
                //验证verifyDisabled
                scope.$verifyDisabled = function (head, item) {
                    if (head.verifyDisabled) {
                        var eqs = head.verifyDisabled.eq.split(',');
                        for (var i = 0; i < eqs.length; i++) {
                            if (eqs[i] == (item[head.verifyDisabled.filed] + '')) {
                                return true;
                            }
                        }
                    }
                    return false;
                }

                //鼠标移开事件
                scope.gridRowsBlur = function (index, call,obj) {

                    //console.log(input);
                    //if (typeof scope.$parent[input.call] === 'function')
                    if(call){
                        scope.$parent[call](index, obj);
                    }

                    //if (input.openModal)
                    //    $(input.openModal).modal();
                }


            }
        }
    }]);
});