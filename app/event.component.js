"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var api_service_1 = require("./api.service");
var router_1 = require("@angular/router");
var app_global_service_1 = require("./app.global.service");
var EventComponent = (function () {
    function EventComponent(httpService, route, gs) {
        this.httpService = httpService;
        this.route = route;
        this.gs = gs;
        this.innerpage = true;
        this.bookingStatus = false;
        this.isDisable = true;
        this.seats = 1;
    }
    EventComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            _this.timeslot_id = +params['id'];
            _this.loadEvent();
            if (!_this.gs.isAuthenticated) {
                _this.httpService.getInfo().subscribe(function (data) {
                    _this.checkBooking();
                    _this.isDisable = false;
                });
            }
            else {
                _this.checkBooking();
                _this.isDisable = false;
            }
        });
    };
    EventComponent.prototype.loadEvent = function () {
        var _this = this;
        this.httpService.getEventById(this.timeslot_id).subscribe(function (data) {
            if (data.activity) {
                _this.event = data.activity;
            }
        });
    };
    EventComponent.prototype.checkBooking = function () {
        console.log('erewerw');
        for (var i in this.gs.userInfo.bookings) {
            if (this.gs.userInfo.bookings[i].time_slot.id == this.timeslot_id) {
                this.bookingStatus = true;
                this.bookingId = this.gs.userInfo.bookings[i].id;
                return;
            }
        }
        this.bookingStatus = false;
    };
    EventComponent.prototype.addTicket = function () {
        if (this.seats < this.event.locations[0].time_slots[0].free_seats)
            this.seats += 1;
    };
    EventComponent.prototype.removeTicket = function () {
        if (this.seats > 1)
            this.seats -= 1;
    };
    EventComponent.prototype.makingBooking = function (timeSlotID) {
        var _this = this;
        this.isDisable = true;
        this.httpService.makingBooking(timeSlotID, this.seats).subscribe(function (data) {
            console.log(data);
            if (data.status == "OK") {
                _this.gs.msg = "Отлично! Все получилось! Проверьте Вашу электронную почту, Вам должно прийти уведомление";
                _this.gs.getUserInfo();
                _this.loadEvent();
                _this.bookingId = data.booking_id;
                _this.bookingStatus = true;
                _this.gs.openPopup('msg');
            }
            else {
                if (data.reason == "TIME_SLOT_REGISTRATION_IS_OVER") {
                    _this.gs.msg = "Завершено бронирование мест на выбранное мероприятие";
                }
                else {
                    _this.gs.msg = "Что-то пошло не так. Попробуйте обновить страницу";
                }
                _this.gs.openPopup('msgCancel');
            }
            $("html").addClass('locked');
            _this.isDisable = false;
        });
        ;
    };
    EventComponent.prototype.cancelBooking = function (timeSlotID) {
        var _this = this;
        this.isDisable = true;
        this.httpService.cancelBooking(timeSlotID).subscribe(function (data) {
            if (data.status == "OK") {
                _this.gs.msg = "Ваше бронирование успешно отменено";
                _this.gs.getUserInfo();
                _this.loadEvent();
                _this.bookingStatus = false;
                _this.gs.openPopup('msg');
            }
            else {
                if (data.reason == "CANCELLATION_NOT_POSSIBLE") {
                    _this.gs.msg = "Отмена бронирования невозможна";
                }
                else if (data.reason == "ALREADY_CANCELLED") {
                    _this.gs.msg = "Бронирование уже отменено";
                }
                else {
                    _this.gs.msg = "Что-то пошло не так. Попробуйте обновить страницу";
                }
                _this.gs.openPopup('msgCancel');
            }
            $("html").addClass('locked');
            _this.isDisable = false;
        });
        ;
    };
    EventComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    return EventComponent;
}());
EventComponent = __decorate([
    core_1.Component({
        selector: 'event',
        templateUrl: 'event.html',
        providers: [api_service_1.Api]
    }),
    __metadata("design:paramtypes", [api_service_1.Api, router_1.ActivatedRoute, app_global_service_1.GlobalService])
], EventComponent);
exports.EventComponent = EventComponent;
//# sourceMappingURL=event.component.js.map