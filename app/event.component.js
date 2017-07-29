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
var moment = require("moment");
var EventComponent = (function () {
    function EventComponent(httpService, route, gs) {
        this.httpService = httpService;
        this.route = route;
        this.gs = gs;
        this.innerpage = true;
        this.bookingStatus = false;
        this.isDisable = true;
        this.seats = 1;
        this.subscriptionPrice = 0;
        this.subscriptionDate = moment(new Date()).add(1, 'month').format();
        this.discount = 0;
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
                    _this.needSubscription();
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
                if (data.activity.locations[0].time_slots[0].price_without_discount > 0)
                    _this.discount = (1 - data.activity.locations[0].time_slots[0].price / data.activity.locations[0].time_slots[0].price_without_discount) * 100;
                _this.needSubscription();
            }
        });
    };
    EventComponent.prototype.checkBooking = function () {
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
    EventComponent.prototype.needSubscription = function () {
        if (this.gs.userInfo.subscription) {
            if (this.event && this.event.locations) {
                var eventDate = new Date(this.event.locations[0].time_slots[0].date.replace(/(\d+).(\d+).(\d+)/, '$3-$2-$1'));
                var subscriptionExpires = new Date(this.gs.userInfo.subscription.expires_at.replace(/(\d+).(\d+).(\d+)/, '$3-$2-$1'));
                if ((eventDate - subscriptionExpires) > 0) {
                    this.subscriptionPrice = 200;
                    this.subscriptionDate = moment(subscriptionExpires).add(1, 'month').format();
                }
                else {
                    this.subscriptionPrice = 0;
                }
            }
        }
        else {
            this.subscriptionPrice = 200;
            this.subscriptionDate = moment(new Date()).add(1, 'month').format();
        }
    };
    EventComponent.prototype.makingBooking = function () {
        var _this = this;
        if (!this.gs.isAuthenticated)
            this.gs.openPopup('login');
        else {
            this.isDisable = true;
            var price = this.event.locations[0].time_slots[0].price * this.seats + this.subscriptionPrice;
            var userBalance = 0;
            if (this.gs.userInfo.subscription) {
                userBalance += this.gs.userInfo.subscription.balance;
            }
            if ((price - userBalance) <= 0) {
                if (this.subscriptionPrice) {
                    this.httpService.initTransaction('SM', this.subscriptionPrice).subscribe(function (data) {
                        if (data.status == 'OK') {
                            _this.httpService.checkTransaction(data.transaction.id).subscribe(function (data) {
                                if (data.status = "OK") {
                                    if (data.transaction.status == 'C') {
                                        _this.book();
                                    }
                                    else {
                                        _this.gs.msg = "Что-то пошло не так. Попробуйте обновить страницу";
                                        _this.gs.openPopup('msgCancel');
                                    }
                                }
                            });
                        }
                    });
                }
                else {
                    this.book();
                }
            }
            else {
                localStorage.setItem('timeslot_id', JSON.stringify(this.timeslot_id));
                localStorage.setItem('seats', JSON.stringify(this.seats));
                if (this.subscriptionPrice)
                    this.gs.initTransaction('SB', (price - userBalance));
                else
                    this.gs.initTransaction('B', (price - userBalance));
            }
        }
    };
    EventComponent.prototype.book = function () {
        var _this = this;
        this.httpService.makingBooking(this.timeslot_id, this.seats).subscribe(function (data) {
            if (data.status == "OK") {
                _this.gs.msg = "Бронь №" + data.reference_number + " успешно оформлена. Проверьте Вашу электронную почту, Вам должно прийти уведомление";
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
            _this.isDisable = false;
        });
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
        templateUrl: 'static/event.html',
        providers: [api_service_1.Api]
    }),
    __metadata("design:paramtypes", [api_service_1.Api, router_1.ActivatedRoute, app_global_service_1.GlobalService])
], EventComponent);
exports.EventComponent = EventComponent;
//# sourceMappingURL=event.component.js.map