import {Injectable, Inject} from '@angular/core';
import { Api } from './api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable()
export class GlobalService {
	isAuthenticated: boolean;
	innerpage: boolean;
	userInfo: any;
	popupName: string;
	msg:string;

	email: string;
	phone:string;

	phoneMask:any;

	contactsForm: FormGroup;

	constructor(public httpService: Api, private fb: FormBuilder){
		this.userInfo = {};
		this.isAuthenticated = false;
		this.popupName = '';
		this.getUserInfo();
		this.innerpage = false;
		this.msg = '';
		this.email = '';
		this.phone = '';
		this.phoneMask = ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
	}

	openPopup(name:string) {
		this.popupName = name;
		$("html").addClass('locked');
	}

	getUserInfo() : void {
		this.httpService.getInfo().subscribe((data:any) => {
			this.parseUserInfo(data);
		});
	}

	parseUserInfo(data:any):void {
		let th = this;
		if(data.status == 'ERROR') {
			this.isAuthenticated = false;
			this.userInfo = {};
			setTimeout(function(){
				th.initSlider();
			}, 100);
		} else {
			if(localStorage.getItem('transaction.id'))
				this.httpService.checkTransaction(localStorage.getItem('transaction.id')).subscribe((data:any) => {
					if(data.status = "OK") {
						if (data.transaction.status == 'F') {
							this.msg = "Платеж отклонен";
							this.popupName = 'msgCancel';
							localStorage.removeItem('transaction.id');
						} else if (data.transaction.status == 'I') {
							this.msg = "Завершите процедуру оплаты";
							this.popupName = 'msgCancel';
							localStorage.removeItem('transaction.id');
						} else if (data.transaction.status == 'C') {
							this.msg = "Оплата прошла успешно";
							this.popupName = 'msg';
							localStorage.removeItem('transaction.id');
							this.getUserInfo();
						}
					} else {
						localStorage.removeItem('transaction.id');
					}
				});
			this.userInfo = data;
			this.isAuthenticated = true;
			this.email = this.userInfo.email;
			this.phone = this.userInfo.phone;
			this.contactsForm = this.fb.group({
				'email': [this.email, [
							Validators.required,
							Validators.pattern("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
							]
						],
				'phone': [this.phone, [
							Validators.required,
							// Validators.pattern("/^([+][0-9]\([0-9]{3}\) [0-9]{3}-[0-9]{4})$/")
							]
						]
			})
			if (!this.userInfo.phone || !this.userInfo.email) 
				this.popupName = 'updateInfo';
		}
	}

	initSlider() : void {
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
	}

	logout() : void {
		this.httpService.logout().subscribe((data:any) => {
			this.getUserInfo();
		});
	}

	update(form:any) : void {
		this.email = form.controls.email.value;
		this.phone = form.controls.phone.value;
		if (this.email && this.phone) {
			let body = {
				phone: this.phone, 
				email: this.email
			};
			this.httpService.updateInfo(JSON.stringify(body)).subscribe((data:any) => {
				if (data.phone && data.email) {
					this.popupName = '';
					$("html").removeClass('locked');
					this.userInfo.phone = this.phone;
					this.userInfo.email = this.email;
				}
			});
		}
	}
}