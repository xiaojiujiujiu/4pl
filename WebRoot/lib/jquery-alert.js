/**
 * Created by xuwusheng on 16/3/22.
 */
(function ($,window) {
    var app= {};
    app.alert= function (title,callBack) {
        var $alert= $('#alert'),
            $enter=$alert.find('.alert-enter');
        $alert.find('.addStation h5').text(title);
        $enter.unbind('click');
        $enter.on('click', function () {
            if(callBack instanceof Function)
                callBack();
            $alert.modal('hide');
        });
        $alert.modal();
    }
    app.template='';
    window.owAlert= app;
})($,window);