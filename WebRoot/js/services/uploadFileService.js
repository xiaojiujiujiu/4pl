/**
 * Created by xuwusheng on 16/3/14.
 */
define(['./appService'], function (service) {
	var service = angular.module('app.service');
    service.factory('uploadFileService', ['$http', '$q', '$filter', 'HOST', 'Upload', function ($http, $q, $filter, HOST, Upload) {
        return {
            /**
             * 上传文件
             * @param url 上传地址
             * @param file 文件
             * @param progressCallBack 进度回调
             */
            upload: function (url, file,param, progressCallBack) {
                var newFiles;
                if(!!param){
                    newFiles={file:file,'param':param}
                }else{
                    newFiles={file:file}
                }
                var deferred = $q.defer();
                Upload.upload({
                    url: HOST+url,
                    data: newFiles,
                }).then(function (resp) {
                    deferred.resolve(resp);
                    //console.log('上传成功 ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                }, function (resp) {
                    deferred.reject(resp);
                    //console.log('Error status: ' + resp.status);
                }, function (evt) {
                    progressCallBack(evt);
                });
                return deferred.promise;
            }
        }
    }]);
});