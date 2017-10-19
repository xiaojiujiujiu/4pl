/*
 *  Author    : hui.sun
 *  Time      : 2015.12.1
 */
;
(function($) {
	$.fn.extend({
		// 弹窗
		/* 
		* var eleContent = {
		* 	title: 'title',      // 弹窗标题
		* 	content: 'content',  // 弹窗内容
		* 	animation: true      // 是否显示动画， true或false
		* }
		* $('body').pluginAlert(eleContent);
		*/
		pluginAlert: function(options) {
			if (typeof(options) != 'object') {
				return false;
			}
			var alertEle = '<div id="plugin-alert" >' +
				'<h3 class="popover-title">' + options.title + '</h3>' +
				'<div class="popover-content">' + options.content + '</div>' +
				'</div>';
			var alertBackground = '<div class="alert-background"></div>'
			$(this).on('click', function() {
				if (!$('#plugin-alert')[0]) {
					$('.ct-right').append(alertEle);
					options.animation ? $('#plugin-alert').animate({
							opacity: 1
						}) :
						$('#plugin-alert').css({
							opacity: 1
						});
					$('#plugin-alert').css({
						left: $('.ct-right').width() / 2 - $('#plugin-alert').width() / 2,
						top: $('.ct-right').height() / 2 - $('#plugin-alert').height() / 2
					})
					if (!$('#plugin-background')[0]) {
						$('.ct-right').append(alertBackground);
					}
				} else {
					return false;
				}
				if ($('.alert-background')[0]) {
					$('.alert-background').on('click', function(e) {
						$this = $(this);
						e.stopPropagation();
						if (options.animation) {
							$('#plugin-alert').animate({
								opacity: 0
							});
							setTimeout(function() {
								$('#plugin-alert').remove();
								$this.remove();
							}, 500);
						} else {
							$('#plugin-alert').css({
								opacity: 0
							});
							$('#plugin-alert').remove();
							$this.remove();
						}

					})
				}
			})
		}
	})
	
})(jQuery)