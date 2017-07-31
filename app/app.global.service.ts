import {Injectable, Inject} from '@angular/core';
import { Api } from './api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';

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
	extendSubscription:boolean;
	newSubscription:boolean;

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
		this.extendSubscription = false;
		this.newSubscription = false;
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
		} else {
			if(localStorage.getItem('transaction.id'))
				this.httpService.checkTransaction(localStorage.getItem('transaction.id')).subscribe((data:any) => {
					if(data.status = "OK") {
						if (data.transaction.status == 'F') {
							if(localStorage.getItem('timeslot_id')) 
								this.msg = "Не удалось осуществить бронирование. Платеж отклонен. Попробуйте еще раз";
							else
								this.msg = "Платеж отклонен";

							this.openPopup('msgCancel');
							localStorage.removeItem('transaction.id');
							localStorage.removeItem('timeslot_id');
							localStorage.removeItem('seats');
						} else if (data.transaction.status == 'I') {
							this.msg = "Завершите процедуру оплаты";
							this.openPopup('msgCancel');
							localStorage.removeItem('transaction.id');
						} else if (data.transaction.status == 'C') {
							if(localStorage.getItem('timeslot_id')) {
								let timeslot : number = + localStorage.getItem('timeslot_id');
								let seats : number = + localStorage.getItem('seats');

								this.httpService.makingBooking(timeslot, seats).subscribe((data:any) => {
									if (data.status == "OK") {
										this.msg = "Бронь №"+data.reference_number+" оформлена. Проверьте Вашу электронную почту и СМС, Вам должно прийти уведомление";
										this.getUserInfo();
										this.openPopup('msg');
									} else {
										if (data.reason == "TIME_SLOT_REGISTRATION_IS_OVER") {
											this.msg = "Завершено бронирование мест на выбранное мероприятие";
										} else {
											this.msg = "Что-то пошло не так. Попробуйте обновить страницу";
										}
										this.openPopup('msgCancel');
									}
									localStorage.removeItem('timeslot_id');
									localStorage.removeItem('seats');
								});
							} else {
								this.newSubscription = true;
							}
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
			else if(this.userInfo.subscription) {
				var today : any = moment(new Date()).add(7,'days').format();
				var subscription : any = moment(new Date(this.userInfo.subscription.expires_at.replace(/(\d+).(\d+).(\d+)/,'$3-$2-$1'))).format();

				if ( moment(today).isAfter(subscription, 'day') )
					this.extendSubscription = true;
				else
					this.extendSubscription = false;
			} else if(!this.userInfo.subscription) {
				this.popupName = "extendSubscription";
				this.extendSubscription = true;
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

	initTransaction(type:string, amount:number) {
		this.httpService.initTransaction(type, amount).subscribe((data:any) => {
			if(data.status == 'OK') {
				localStorage.setItem('transaction.id', JSON.stringify(data.transaction.id));
				window.location.href = data.alfa.formUrl;
			}
		});
	}
}