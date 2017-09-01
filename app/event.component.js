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
Object.defineProperty(exports, "__esModule", { value: true });
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
    EventComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            _this.timeslot_id = +params['id'];
            _this.date = params['date'];
            _this.loadEvent();
            if (!_this.gs.isAuthenticated) {
                _this.httpService.getInfo().subscribe(function (data) {
                    _this.needSubscription();
                });
            }
        });
    };
    EventComponent.prototype.loadEvent = function () {
        var _this = this;
        this.httpService.getEventById(this.timeslot_id, this.date).subscribe(function (data) {
            if (data.activity) {
                for (var i in data.activity.locations) {
                    for (var j in data.activity.locations[i].time_slots) {
                        var date = moment(data.activity.locations[i].time_slots[j].date.replace(/(\d+).(\d+).(\d+)/, '$3-$2-$1')).add(data.activity.locations[i].time_slots[j].start_time.split(':')[0], 'h').format();
                        data.activity.locations[i].time_slots[j].date = date;
                        for (var z in data.activity.locations[i].time_slots[j].tickets) {
                            var d = data.activity.locations[i].time_slots[j].tickets[z];
                            if (d.price_without_discount > 0) {
                                var discount = d.price_without_discount - d.price;
                                // var discount = (1-d.price/d.price_without_discount)*100;
                                data.activity.locations[i].time_slots[j].tickets[z].discount = discount;
                            }
                            data.activity.locations[i].time_slots[j].tickets[z].seats = 0;
                        }
                    }
                }
                _this.event = data.activity;
                _this.needSubscription();
                ga('send', 'pageview', '/virtual/eventopened');
            }
        });
    };
    EventComponent.prototype.addTicket = function (ticket) {
        if (ticket.seats < ticket.allocated_seats) {
            ticket.seats += 1;
            this.calcTotal();
        }
    };
    EventComponent.prototype.removeTicket = function (ticket) {
        if (ticket.seats >= 1) {
            ticket.seats -= 1;
            this.calcTotal();
        }
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
    EventComponent.prototype.calcTotal = function () {
        this.total = 0;
        this.discount = 0;
        for (var i in this.event.locations[this.selectedLocation].time_slots[this.selectedTime].tickets) {
            var d = this.event.locations[this.selectedLocation].time_slots[this.selectedTime].tickets[i];
            this.total += d.price * d.seats;
            this.discount += d.discount * d.seats;
        }
    };
    EventComponent.prototype.makingBooking = function () {
        var _this = this;
        if (!this.gs.isAuthenticated)
            this.gs.openPopup('login');
        else {
            if (this.total > 0) {
                ga('send', 'pageview', '/virtual/bookbtnclicked');
                this.isDisable = true;
                var price = this.total + this.subscriptionPrice;
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
                    localStorage.setItem('timeslot_id', JSON.stringify(this.event.locations[this.selectedLocation].time_slots[this.selectedTime].id));
                    localStorage.setItem('seats', JSON.stringify(this.seats));
                    if (this.subscriptionPrice)
                        this.gs.initTransaction('SB', (price - userBalance));
                    else
                        this.gs.initTransaction('B', (price - userBalance));
                }
            }
        }
    };
    EventComponent.prototype.book = function () {
        var _this = this;
        var tickets = this.event.locations[this.selectedLocation].time_slots[this.selectedTime].tickets;
        console.log(tickets);
        var data = {};
        for (var i in tickets) {
            console.log(i);
            if (tickets[i].seats > 0) {
                data[tickets[i].ticket_type_key] = tickets[i].seats;
            }
        }
        console.log(data);
        this.httpService.makingBooking(this.event.locations[this.selectedLocation].time_slots[this.selectedTime].id, data).subscribe(function (data) {
            if (data.status == "OK") {
                _this.gs.booking_id = data.booking_id;
                _this.gs.getUserInfo();
                _this.loadEvent();
                ga('send', 'pageview', '/virtual/bookingdone');
                _this.gs.openPopup('booking');
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
    EventComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    return EventComponent;
}());
EventComponent = __decorate([
    core_1.Component({
        selector: 'event',
        templateUrl: "../static/event.html?v=" + new Date().getTime(),
        providers: [api_service_1.Api]
    }),
    __metadata("design:paramtypes", [api_service_1.Api, router_1.ActivatedRoute, app_global_service_1.GlobalService])
], EventComponent);
exports.EventComponent = EventComponent;
//# sourceMappingURL=event.component.js.map