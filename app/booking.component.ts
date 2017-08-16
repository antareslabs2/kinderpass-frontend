import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Api } from './api.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from './app.global.service';

import * as moment from 'moment';

@Component({
	selector: 'booking',
	templateUrl: `../static/booking.html?v=${new Date().getTime()}`,
	providers: [Api]
})

export class BookingComponent implements OnInit, OnDestroy  { 
	
	booking_id:number;
	private sub: any;
	innerpage: boolean;
	event: any;

	constructor(private httpService: Api, private route: ActivatedRoute, private gs: GlobalService){
		this.innerpage = true;
	}

	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			this.booking_id = +params['id'];
			this.loadBooking();
		});
	}

	loadBooking() :void {
		this.httpService.getBookingById(this.booking_id).subscribe((data:any) => {
			if(data.activity){
				this.event = data.activity;
			}
		});
	}
	
	cancelBooking(timeSlotID:number) : void {
		this.httpService.cancelBooking(timeSlotID).subscribe((data:any) => {
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

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

}	