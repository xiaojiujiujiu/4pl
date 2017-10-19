var common = window.common = {};
// 这个文件除非添加了内容，如果只是改host路径，不要提交
common.contextpath = 'http://test2.ebaigee.com';

//common.host = 'http://172.16.0.137:8083/portal';
//common.ehost = 'http://172.16.0.137:8084/express';
common.host = 'http://172.16.1.236:8082/portal';

common.tokenInfo='';
// 截取URL参数; 参数：URL
common.parseQueryString = function(url){
	var pos;
    var obj = {};
    if ( ( pos = url.indexOf("?") ) != -1 ) {
        var param = url.substring( pos + 1, url.length),
          eg=/tokenId=(.*)&sessionid=[^(.*)&]*/,
            tiStr='';
        try {
            tiStr=param.match(eg)[0];
        }catch (e){

        }
        common.tokenInfo=tiStr;
      
        param = param.replace(eg,'');
        if(tiStr!='')
        	param=param.substring(1,param.length);
        var paramArr = param.split('&');
        var keyValue = [];
        for ( var i = 0, l = paramArr.length; i < l; i++ ) {
            keyValue = paramArr[i].split('=');
            obj[keyValue[0]] = keyValue[1];
        }
    }
    return obj;
}
//关闭窗口
common.closeWindow= function () {
    if(confirm('确定关闭当前页面吗?')) {
        window.opener = null;
        window.open('', '_self');
        window.close();
    }
}