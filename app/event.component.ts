import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Api } from './api.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from './app.global.service';

import * as moment from 'moment';

@Component({
	selector: 'event',
	templateUrl: `static/event.html?v=${new Date().getTime()}`,
	providers: [Api]
})

export class EventComponent implements OnInit, OnDestroy  { 
	
	timeslot_id:number;
	date:string;
	private sub: any;
	innerpage: boolean;
	event: any;
	seats:number;
	isDisable:boolean;

	subscriptionDate: any;
	subscriptionPrice: number;

	discount : number;
	selectedLocation : number;
	selectedTime : number;
	
	showEvent : boolean;

	constructor(private httpService: Api, private route: ActivatedRoute, private gs: GlobalService){
		this.innerpage = true;
		this.isDisable = true;
		this.seats = 1;
		this.subscriptionPrice = 0;
		this.subscriptionDate = moment(new Date()).add(1, 'month').format();
		this.discount = 0;
		this.selectedLocation = 0;
		this.selectedTime = 0;
		this.showEvent = false;
	}

	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			this.timeslot_id = +params['id'];
			this.date = params['date'];
			this.loadEvent();
			if(!this.gs.isAuthenticated){
				this.httpService.getInfo().subscribe((data:any) => {
					this.needSubscription();
				});
			}
		});
	}

	loadEvent() :void {
		this.httpService.getEventById(this.timeslot_id, this.date).subscribe((data:any) => {
			if(data.activity){
				this.event = data.activity;
				// if (data.activity.locations[0].time_slots[0].price_without_discount > 0)
				// 	this.discount = (1-data.activity.locations[0].time_slots[0].price/data.activity.locations[0].time_slots[0].price_without_discount)*100;
				this.needSubscription();
			}
		});
	}

	addTicket() : void {
		if (this.seats < this.event.locations[0].time_slots[0].free_seats)
			this.seats +=1;
	}

	removeTicket() : void {
		if (this.seats > 1)
			this.seats -=1;
	}

	needSubscription() : void {
		if (this.gs.userInfo.subscription) {
			if (this.event && this.event.locations) {
				let eventDate : any = new Date(this.event.locations[0].time_slots[0].date.replace(/(\d+).(\d+).(\d+)/,'$3-$2-$1'));
				let subscriptionExpires : any = new Date(this.gs.userInfo.subscription.expires_at.replace(/(\d+).(\d+).(\d+)/,'$3-$2-$1'));
				if ((eventDate - subscriptionExpires) > 0) {
					this.subscriptionPrice = 200;
					this.subscriptionDate = moment(subscriptionExpires).add(1, 'month').format();
				} else {
					this.subscriptionPrice = 0;
				}
			}
		} else {
			this.subscriptionPrice = 200;
			this.subscriptionDate = moment(new Date()).add(1, 'month').format();
		}
	}

	makingBooking() : void {
		if (!this.gs.isAuthenticated)
			this.gs.openPopup('login');
		else {
			this.isDisable = true;
			let price = this.event.locations[this.selectedLocation].time_slots[this.selectedTime].price * this.seats + this.subscriptionPrice;
			let userBalance = 0;
			if (this.gs.userInfo.subscription) {
				userBalance += this.gs.userInfo.subscription.balance;
			}
			if ((price - userBalance) <= 0) {
				if(this.subscriptionPrice) {
					this.httpService.initTransaction('SM', this.subscriptionPrice).subscribe((data:any) => {
						if(data.status == 'OK') {
							this.httpService.checkTransaction(data.transaction.id).subscribe((data:any) => {
								if(data.status = "OK") {
									if (data.transaction.status == 'C') {
										this.book();
									} else {
										this.gs.msg = "Что-то пошло не так. Попробуйте обновить страницу";
										this.gs.openPopup('msgCancel');
									}
								}
							})
						}
					});
				} else {
					this.book();
				}
			} else {
				localStorage.setItem('timeslot_id', JSON.stringify(this.event.locations[this.selectedLocation].time_slots[this.selectedTime].id));
				localStorage.setItem('seats', JSON.stringify(this.seats));
				if(this.subscriptionPrice)
					this.gs.initTransaction('SB', (price - userBalance));
				else
					this.gs.initTransaction('B', (price - userBalance));
			}
		}
	}

	book() {
		this.httpService.makingBooking(this.event.locations[this.selectedLocation].time_slots[this.selectedTime].id,this.seats).subscribe((data:any) => {
			if (data.status == "OK") {
				this.gs.booking_id = data.booking_id;

				this.gs.getUserInfo();
				this.loadEvent();
				this.gs.openPopup('booking');
			} else {
				if (data.reason == "TIME_SLOT_REGISTRATION_IS_OVER") {
					this.gs.msg = "Завершено бронирование мест на выбранное мероприятие";
				} else {
					this.gs.msg = "Что-то пошло не так. Попробуйте обновить страницу";
				}
				this.gs.openPopup('msgCancel');
			}
			this.isDisable = false;
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

}	