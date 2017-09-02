import { Component, OnInit } from '@angular/core';
import { Api } from './api.service';
import { GlobalService } from './app.global.service';
import { Location } from '@angular/common'

import * as moment from 'moment';

@Component({
	selector: 'bookings',
	templateUrl: `../static/bookings.html?v=${new Date().getTime()}`,
	providers: [Api]
})

export class BookingsComponent implements OnInit { 
	
	booking_id:number;
	innerpage: boolean;
	bookings: any[];
 
	constructor(private httpService: Api, private gs: GlobalService, private _location: Location){
		this.innerpage = true;
		this.bookings = [];
	}

	ngOnInit(){
		if (this.gs.isAuthenticated && this.gs.userInfo.bookings) {
			this.parseBookings(this.gs.userInfo.bookings);
		} else {
			this.httpService.getInfo().subscribe((data:any) => {
				this.parseBookings(data.bookings)
			});
		}
	}

	parseBookings(bookingIds : any) :void {
		let today = moment(new Date()).format();
		for( let booking in bookingIds) {
			this.httpService.getBookingById(bookingIds[booking].id).subscribe((data:any) => {
				if(data.activity){
					var date = moment(data.activity.time_slot.date.replace(/(\d+).(\d+).(\d+)/,'$3-$2-$1')).add(data.activity.time_slot.start_time.split(':')[0], 'h').format();
					data.activity.time_slot.date = date;
					data.activity.days_to_event = moment(date).diff(today, 'days');
					data.activity.time_to_event = moment(date).diff(today, 'hours') - data.activity.days_to_event*24;

					let ticket

					data.activity.total = 0;
					for(let i in data.activity.tickets) {
						for(let j in data.activity.time_slot.tickets) {
							if (data.activity.time_slot.tickets[j].ticket_type_key == data.activity.tickets[i].ticket_type_key) {
								data.activity.tickets[i].price = data.activity.time_slot.tickets[j].price;
							}
						}
						data.activity.total += data.activity.tickets[i].price * data.activity.tickets[i].seats;
					}
					this.bookings.push(data.activity);
				}
			});
		}
	}
	
	cancelBooking(bookingId:number) : void {
		console.log(bookingId)
		this.httpService.cancelBooking(bookingId).subscribe((data:any) => {
			if (data.status == "OK") {
				this.gs.msg = "Ваше бронирование успешно отменено";
				this.gs.getUserInfo();
				// this.loadBooking();
				this.gs.openPopup('goToUrl');
			} else {
				if (data.reason == "CANCELLATION_NOT_POSSIBLE") {
					this.gs.msg = "Отмена бронирования невозможна";
				} else if (data.reason == "ALREADY_CANCELLED") {
					this.gs.msg = "Бронирование уже отменено";
				} else {
					this.gs.msg = "Что-то пошло не так. Попробуйте обновить страницу";
				}
				this.gs.openPopup('msgCancel');
			}
		});;
	}

	goBack() {
        this._location.back();
    }

}	