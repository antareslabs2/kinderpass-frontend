import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Api } from './api.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from './app.global.service';

import * as moment from 'moment';
declare var ga:Function;

@Component({
	selector: 'event',
	templateUrl: `../static/event.html?v=${new Date().getTime()}`,
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
	selectedTicket : number;
	
	total: number;
	discount: number;

	constructor(private httpService: Api, private route: ActivatedRoute, private gs: GlobalService){
		this.innerpage = true;
		this.isDisable = true;
		this.seats = 0;
		this.subscriptionPrice = 0;
		this.subscriptionDate = moment(new Date()).add(1, 'month').format();
		this.discount = 0;
		this.selectedLocation = 0;
		this.selectedTime = 0;
		this.selectedTicket = 0;
		this.total = 0;
		this.discount = 0;
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
				for( var i in data.activity.locations) {
					for (var j in data.activity.locations[i].time_slots) {
						var date = moment(data.activity.locations[i].time_slots[j].date.replace(/(\d+).(\d+).(\d+)/,'$3-$2-$1')).add(data.activity.locations[i].time_slots[j].start_time.split(':')[0], 'h').format();
						data.activity.locations[i].time_slots[j].date = date;
						for(var z in data.activity.locations[i].time_slots[j].tickets) {
							var d = data.activity.locations[i].time_slots[j].tickets[z];
							if (d.price_without_discount > 0) {
								var discount = d.price_without_discount - d.price;
								// var discount = (1-d.price/d.price_without_discount)*100;
								data.activity.locations[i].	time_slots[j].tickets[z].discount = discount;
							}
							data.activity.locations[i].time_slots[j].tickets[z].seats = 0;	

						}
					}
				}
				this.event = data.activity;
				this.needSubscription();

				ga('send', 'pageview', '/virtual/eventopened');
			}
		});
	}

	addTicket(ticket: any) : void {
		if (ticket.seats < ticket.allocated_seats) {
			ticket.seats +=1;
			this.calcTotal();
		}
	}

	removeTicket(ticket: any) : void {
		if (ticket.seats >= 1) {
			ticket.seats -=1;
			this.calcTotal();
		}
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

	calcTotal(): void {
		this.total = 0;
		this.discount = 0;
		for(var i in this.event.locations[this.selectedLocation].time_slots[this.selectedTime].tickets) {
			var d = this.event.locations[this.selectedLocation].time_slots[this.selectedTime].tickets[i];
			this.total += d.price * d.seats;	
			this.discount += d.discount * d.seats;	

		}
	}

	makingBooking() : void {

		if (!this.gs.isAuthenticated)
			this.gs.openPopup('login');
		else {
			if(this.total > 0) {
				ga('send', 'pageview', '/virtual/bookbtnclicked');
				this.isDisable = true;
				let price = this.total + this.subscriptionPrice;
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
	}

	book() {
		let tickets = this.event.locations[this.selectedLocation].time_slots[this.selectedTime].tickets;
		console.log(tickets);
		var data = {};
		for (let i in tickets) {
			console.log(i)
			if(tickets[i].seats > 0) {
				data[tickets[i].ticket_type_key] = tickets[i].seats;
			}
		}
		console.log(data)
		this.httpService.makingBooking(this.event.locations[this.selectedLocation].time_slots[this.selectedTime].id,data).subscribe((data:any) => {
			if (data.status == "OK") {
				this.gs.booking_id = data.booking_id;

				this.gs.getUserInfo();
				this.loadEvent();
				ga('send', 'pageview', '/virtual/bookingdone');
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