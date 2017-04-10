(function(){

	$(function(){

		var view = {

			window: $(window),
			document: $(document),
			html: $('html'),
			body: $('body'),
			
			init: function(){
				this.initSlider();
				this.listeners();
				$(":input").inputmask();
			},

			onResize: function(){
				this.refreshSlider();
			},

			initSlider: function() {
				if($('.slider').length) {
					$('.slider').slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						arrows: true,
						dots: true,
						fade: true,
						prevArrow: $('.slider-arrow-prev'),
						nextArrow: $('.slider-arrow-next')
					});
				}
				if($('.advantages-slider').length) {
					if ($(window).width() <= 420) {
						$('.advantages-slider').slick({
							slidesToShow: 1,
							slidesToScroll: 1,
							arrows: false,
							dots: true
						});
					} else {
						if ($('.advantages-slider').hasClass('slick-initialized')) {
							$('.advantages-slider').slick('unslick');
						}
					}
				}
				if($('.steps-wrap').length) {
					if ($(window).width() <= 420) {
						$('.steps-wrap').slick({
							slidesToShow: 1,
							slidesToScroll: 1,
							arrows: false,
							dots: true
						});
					} else {
						if ($('.steps-wrap').hasClass('slick-initialized')) {
							$('.steps-wrap').slick('unslick');
						}
					}
				}
			},

			refreshSlider: function() {
				if($('.advantages-slider').length) {
					if ($(window).width() <= 420) {
						if (!$('.advantages-slider').hasClass('slick-initialized')) {
							$('.advantages-slider').slick({
								slidesToShow: 1,
								slidesToScroll: 1,
								arrows: false,
								dots: true
							});
						}
					} else {
						if ($('.advantages-slider').hasClass('slick-initialized')) {
							$('.advantages-slider').slick('unslick');
						}
					}
				}
				if($('.steps-wrap').length) {
					if ($(window).width() <= 420) {
						if (!$('.steps-wrap').hasClass('slick-initialized')) {
							$('.steps-wrap').slick({
								slidesToShow: 1,
								slidesToScroll: 1,
								arrows: false,
								dots: true
							});
						}
					} else {
						if ($('.steps-wrap').hasClass('slick-initialized')) {
							$('.steps-wrap').slick('unslick');
						}
					}
				}
			},

			setButtonDisabled: function(disabled) {
				var btn = $('form').find('button');
				btn.prop('disabled', disabled);
				if (disabled) {
					btn.css('background-color', '#ccc');
				} else {
					btn.css('background-color', '#02BA4F');
				}
				
			},

			sendData: function(data){
				var app = this;
				var url = "https://script.google.com/macros/s/AKfycbzgnddty88WWhcO1v7OPbQ2UOLXGaCPoKQFAaENPcidsaMs7P4/exec"; //'php/order.php'
				$.ajax({
					url:  url,
					type: 'POST',
					data: data,
					success: function(resp) {
						if (resp.status == 'ok') {
							app.alert('Ваша заявка успешно отправлена, спасибо!')
							ga('send', 'event', 'PreOrder', 'Order');
						} else if ( resp.status == 'error' ) {
							app.enableForm(form);
							app.alert('Что-то пошло не так, попробуйте позже!');
						} else {
							app.alert('Ваша заявка успешно отправлена, спасибо!')
							ga('send', 'event', 'PreOrder', 'Order');
						}
						app.setButtonDisabled(false);
					},
					error: function() {
						app.alert('Что-то пошло не так, попробуйте позже!');
					},
				});
			},

			closePopup: function(){
				$('html,body').removeClass('locked');
				$('#sendForm').fadeOut(500);
				$('#msg').fadeOut(500);
			},

			alert: function(msg, red){
				red = red || false;
				$('#msg').find('.popup-title').html(msg);
				if (red) {
					$('#msg').find('.popup-wrapper').css('background-color', '#ff3366')
				} else {
					$('#msg').find('.popup-wrapper').css('background-color', '#02ba61')
				}
				$('#msg').fadeIn(500);
			},

			validateForm: function(form) {
				var result = [];
				for (c in form.children()) {
					var child = form.children()[c];
					if (child.name == 'name') {
						if (child.value.length < 3) {
							result.push('Имя');
						}
						continue;
					}
					if (child.name == 'phone') {
						if (child.value.indexOf('_') > -1 || child.value.length < 1) {
							result.push('Телефон');
						}
						continue;
					}
					if (child.name == 'email') {
						if (child.value.length < 5 || child.value.indexOf('@') < 0 || child.value.indexOf('.') < 0) {
							result.push('e-mail');
						}
						continue;
					}
					if (child.name == 'kinderpass') {
						if (child.value.length < 3) {
							result.push('Тип абонемента');
						}
						continue;
					}
				}
				return result;

			},
			
			listeners: function(){

				this.document.on('click', '.aside-block-hide', function(){

				})

				.on('click', 'a[href^="#"]', function(){
					event.preventDefault();
					$('html, body').animate({scrollTop: ($($(this).attr('href')).offset().top)}, 1000);
					if($(this).data('kinderpass')) {
						$('.form select').val($(this).data('kinderpass'))
					}
				})
				.on('click', '.options-item', function(){
					$('.options-item').find('.options-mobile').removeClass('checked');
					$(this).find('.options-mobile').toggleClass('checked');
					$('.form select').val($(this).find('.btn').data('kinderpass'));
				})

				.on('submit', 'form', function(e){
					e.preventDefault();
					view.setButtonDisabled(true);
					var invalidFields = view.validateForm($(this));
					if (invalidFields.length == 0) {
						view.sendData($(this).serialize());
					} else {
						if (invalidFields.length == 1) {
							view.alert('Вы неправильно заполнили поле ' + invalidFields[0] + '. Пожалуйста, исправьте ошибку и отправьте заявку еше раз.', true);
						}
						else {
							view.alert('Вы неправильно заполнили поля ' + invalidFields.join(', ') + '. Пожалуйста, исправьте ошибки и отправьте заявку еше раз.', true);	
						}
						view.setButtonDisabled(false);

					}
					
				})

				.on('click', '.modal-close', function(e){
					e.preventDefault();
					view.closePopup();
				})

				.on('click', '.filters-option', function(e){
					$(this).toggleClass('filters-option-active');
				})

				.on('click', '.week-day', function(e){
					$('.week-day').removeClass('week-day-active');
					$(this).toggleClass('week-day-active');
					$('.selectedDay').text($(this).find('.desktop').text());//TBD (,)
				});

			},
		};

		view.init();
		view.window.on('resize', function(){
			view.onResize();
		});
		view.window.on('orientationchange', function(){
			view.onResize();
		});

	})


}())