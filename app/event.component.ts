import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Api } from './api.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from './app.global.service';


@Component({
	selector: 'event',
	templateUrl: 'static/event.html',
	providers: [Api]
})

export class EventComponent implements OnInit, OnDestroy  { 
	
	timeslot_id:number;
	private sub: any;
	innerpage: boolean;
	event: any;
	seats:number;
	bookingStatus: boolean;
	bookingId: number;
	isDisable:boolean;

	constructor(private httpService: Api, private route: ActivatedRoute, private gs: GlobalService){
		this.innerpage = true;
		this.bookingStatus = false;
		this.isDisable = true;
		this.seats = 1;
	}

	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			this.timeslot_id = +params['id'];
			this.loadEvent();
			if(!this.gs.isAuthenticated){
				this.httpService.getInfo().subscribe((data:any) => {
					this.checkBooking();
					this.isDisable = false;
				});
			} else {
				this.checkBooking();
				this.isDisable = false;
			}
		});
	}

	loadEvent() :void {
		this.httpService.getEventById(this.timeslot_id).subscribe((data:any) => {
			if(data.activity){
				this.event = data.activity;
			}
		});
	}
	checkBooking() : void {
		for(let i in this.gs.userInfo.bookings) {
			if (this.gs.userInfo.bookings[i].time_slot.id == this.timeslot_id){
				this.bookingStatus = true;
				this.bookingId = this.gs.userInfo.bookings[i].id;
				return;
			}
		}
		this.bookingStatus = false;
	}

	addTicket() : void {
		if (this.seats < this.event.locations[0].time_slots[0].free_seats)
			this.seats +=1;
	}

	removeTicket() : void {
		if (this.seats > 1)
			this.seats -=1;
	}

	makingBooking(timeSlotID:number) : void {
		this.isDisable = true;
		this.httpService.makingBooking(timeSlotID,this.seats).subscribe((data:any) => {
			console.log(data)
			if (data.status == "OK") {
				this.gs.msg = "Отлично! Все получилось! Проверьте Вашу электронную почту, Вам должно прийти уведомление";
				this.gs.getUserInfo();
				this.loadEvent();
				this.bookingId = data.booking_id;
				this.bookingStatus = true;
				this.gs.openPopup('msg');
			} else {
				if (data.reason == "TIME_SLOT_REGISTRATION_IS_OVER") {
					this.gs.msg = "Завершено бронирование мест на выбранное мероприятие";
				} else {
					this.gs.msg = "Что-то пошло не так. Попробуйте обновить страницу";
				}
				this.gs.openPopup('msgCancel');
			}
			$("html").addClass('locked');
			this.isDisable = false;
		});;
	}

	cancelBooking(timeSlotID:number) : void {
		this.isDisable = true;
		this.httpService.cancelBooking(timeSlotID).subscribe((data:any) => {
			if (data.status == "OK") {
				this.gs.msg = "Ваше бронирование успешно отменено";
				this.gs.getUserInfo();
				this.loadEvent();
				this.bookingStatus = false;
				this.gs.openPopup('msg');
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
			$("html").addClass('locked');
			this.isDisable = false;
		});;
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

}	