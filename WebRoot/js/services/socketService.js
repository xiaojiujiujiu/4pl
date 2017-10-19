/**
 * socket
 */
define(['../app','socket-io'], function (app,io) {
    app.factory('socketService', ['$http', '$filter','$q', 'HOST','$rootScope', function ($http, $filter,$q, HOST,$rootScope) {
    	
//    	var WS_HOST = "ws://localhost:9999";
//    	var WS_HOST = "ws://172.16.21.101:9999";
//    	var socket = io.connect(WS_HOST);
        var socket = null;//暂时不使用 
        return {
          on: function (eventName, callback) {
            socket.on(eventName, function () {  
              var args = arguments;
              $rootScope.$apply(function () {
                callback.apply(socket, args);
              });
            });
          },
          emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
              var args = arguments;
              $rootScope.$apply(function () {
                if (callback) {
                  callback.apply(socket, args);
                }
              });
            })
          }
        };
        
        
        
    }]);
})

