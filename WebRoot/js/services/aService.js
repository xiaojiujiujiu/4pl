/**
 * Created by xiaojiu on 2017/4/26.
 */
define(['angular'],function(angular){
    angular.module('addShareRegion',[])
        .service('shareRegionAdd',['$complie'],function($complie){
            return {
                getShareRegionHtml:getShareRegionHtml
            }



            /*
            * 你之前的JS 在那个里面先改下吧 你吧那个JS HTML 先备份一个 出来
            * maxL 最大追加条数 ,objHtml 要追加到那个html内
            * */
            function  getShareRegionHtml(maxL,objHtml){
               /* var shareList=[];
                var shareArray=[];
                if(!!maxL){
                    for(var i=0;i<maxL;i++){
                        shareList
                    }

                }*/

            }

        })
})