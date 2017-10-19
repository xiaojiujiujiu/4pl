/**
 * author wusheng.xu
 * date 16/6/22
 */
define(['../app'], function (app) {
    app.directive('pl4VerifyMessage', ['$compile',function ($compile) {
        return{
            restrict: 'EA',
            replace:true,
            scope:{
                form:'=formName'
            },
            template:   '<div class="pl4-verify" ng-show="form.$invalid && form.$dirty"></div>',
            link: function (scope,el,attr) {
                var $parent=el.parent();
                var inputs=$($parent).find('input[verify-message]');
                var newScope=scope.$new(true);
                newScope.form=scope.form;
                var vInput=[];
                for (var i=0;i<inputs.length;i++){
                    if(inputs[i].getAttribute('required')==''&&inputs[i].getAttribute('readonly')!=''){
                        var verifys=['required'];
                        if(inputs[i].getAttribute('pl4-verify')){
                            verifys.push(inputs[i].getAttribute('pl4-verify'));
                        }
                        var name=inputs[i].getAttribute('name');
                        vInput.push({name:name,message:inputs[i].getAttribute('verify-message'),verifys:verifys});
                    }
                }
                angular.element(inputs).on('focus', function () {
                    var name=angular.element(this).attr('name');
                    var span=el[0].querySelector('.form-'+name);
                    if(span)
                        span.style.display='block';
                });
                angular.element(inputs).on('blur', function () {
                    var $this=angular.element(this);
                    var name=$this.attr('name');
                    var span=el[0].querySelector('.form-'+name);
                    if(span)
                        span.style.display='none';
                    var isVerify = newScope.form[name].$error[span.getAttribute('verify-field')];
                    if(isVerify){
                        $this.parent().addClass('has-error');
                    }else
                        $this.parent().removeClass('has-error');
                });
                var tmpl='';
                for (var i=0;i<vInput.length;i++){
                    tmpl+='<p>';
                    for (var k=0;k<vInput[i].verifys.length;k++){
                        if(k==0){
                            tmpl+='<span class="form-'+vInput[i].name+'" verify-field="'+vInput[i].verifys[k]+'" ng-show="form.'+vInput[i].name+'.$dirty&&form.'+vInput[i].name+'.$error.'+vInput[i].verifys[k]+'">'+vInput[i].message+'</span>';
                        }else {
                            tmpl+='<span class="form-'+vInput[i].name+'" verify-field="'+vInput[i].verifys[k]+'" ng-show="!form.'+vInput[i].name+'.$error.'+vInput[i].verifys[k-1]+'&&form.'+vInput[i].name+'.$error.'+vInput[i].verifys[k]+'">'+vInput[i].message+'</span>';
                        }
                    }
                    tmpl+='</p>';
                }
                var $compEl=$compile(tmpl)(newScope);
                el.append($compEl);
            }
        }

    }]);
});