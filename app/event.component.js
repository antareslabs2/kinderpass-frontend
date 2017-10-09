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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var api_service_1 = require("./api.service");
var router_1 = require("@angular/router");
var app_global_service_1 = require("./app.global.service");
var ng2_page_scroll_1 = require("ng2-page-scroll");
var platform_browser_1 = require("@angular/platform-browser");
var moment = require("moment");
require('slick-carousel');
var EventComponent = (function () {
    function EventComponent(httpService, route, gs, pageScrollService, document) {
        this.httpService = httpService;
        this.route = route;
        this.gs = gs;
        this.pageScrollService = pageScrollService;
        this.document = document;
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
                        data.activity.locations[i].time_slots[j].tickets.sort(_this.sortTicketsByPrice);
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
                setTimeout(function () { return $('.eventPage-slider').slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                    dots: true,
                    prevArrow: $('.sliderArrow__prev'),
                    nextArrow: $('.sliderArrow__next'),
                    autoplay: true,
                    autoplaySpeed: 3000
                }); }, 0);
            }
        });
    };
    EventComponent.prototype.sortTicketsByPrice = function (a, b) {
        return a.price - b.price;
    };
    EventComponent.prototype.addTicket = function (ticket) {
        if (ticket.seats < ticket.allocated_seats) {
            ticket.seats += 1;
            ga('send', 'pageview', '/virtual/eventaddticket');
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
        // if (this.gs.userInfo.subscription) {
        // 	if (this.event && this.event.locations) {
        // 		let eventDate : any = new Date(this.event.locations[0].time_slots[0].date.replace(/(\d+).(\d+).(\d+)/,'$3-$2-$1'));
        // 		let subscriptionExpires : any = new Date(this.gs.userInfo.subscription.expires_at.replace(/(\d+).(\d+).(\d+)/,'$3-$2-$1'));
        // 		if ((eventDate - subscriptionExpires) > 0) {
        // 			this.subscriptionPrice = 200;
        // 			this.subscriptionDate = moment(subscriptionExpires).add(1, 'month').format();
        // 		} else {
        // 			this.subscriptionPrice = 0;
        // 		}
        // 	}
        // } else {
        // 	this.subscriptionPrice = 200;
        // 	this.subscriptionDate = moment(new Date()).add(1, 'month').format();
        // }
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
    EventComponent.prototype.getBookingInfo = function () {
        var tickets = this.event.locations[this.selectedLocation].time_slots[this.selectedTime].tickets;
        var data = {};
        for (var i in tickets) {
            if (tickets[i].seats > 0) {
                data[tickets[i].ticket_type_key] = tickets[i].seats;
            }
        }
        return data;
    };
    EventComponent.prototype.makingBooking = function () {
        var _this = this;
        if (!this.gs.isAuthenticated) {
            var data = this.getBookingInfo();
            localStorage.setItem('ticketsPrice', JSON.stringify(this.total));
            localStorage.setItem('timeslot_id', this.event.locations[this.selectedLocation].time_slots[this.selectedTime].id);
            localStorage.setItem('seats', JSON.stringify(data));
            this.gs.openLoginPopup(this.date, this.timeslot_id);
        }
        else {
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
                                        var data_1 = _this.getBookingInfo();
                                        var id = _this.event.locations[_this.selectedLocation].time_slots[_this.selectedTime].id;
                                        _this.book(id, data_1);
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
                    var data = this.getBookingInfo();
                    var id = this.event.locations[this.selectedLocation].time_slots[this.selectedTime].id;
                    this.book(id, data);
                }
            }
            else {
                var data = this.getBookingInfo();
                localStorage.setItem('timeslot_id', JSON.stringify(this.event.locations[this.selectedLocation].time_slots[this.selectedTime].id));
                localStorage.setItem('seats', JSON.stringify(data));
                if (this.subscriptionPrice)
                    this.gs.initTransaction('SB', (price - userBalance));
                else
                    this.gs.initTransaction('B', (price - userBalance));
            }
        }
    };
    EventComponent.prototype.book = function (id, data) {
        var _this = this;
        this.httpService.makingBooking(id, data).subscribe(function (data) {
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
    EventComponent.prototype.scrollToTicket = function () {
        var pageScrollInstance = ng2_page_scroll_1.PageScrollInstance.newInstance({ document: this.document, scrollTarget: "#ticket", pageScrollDuration: 100 });
        this.pageScrollService.start(pageScrollInstance);
    };
    EventComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
        $('.eventPage-slider').slick('unslick');
    };
    return EventComponent;
}());
EventComponent = __decorate([
    core_1.Component({
        selector: 'event',
        templateUrl: "../static/event.html?v=" + new Date().getTime(),
        providers: [api_service_1.Api]
    }),
    __param(4, core_1.Inject(platform_browser_1.DOCUMENT)),
    __metadata("design:paramtypes", [api_service_1.Api, router_1.ActivatedRoute, app_global_service_1.GlobalService, ng2_page_scroll_1.PageScrollService, Object])
], EventComponent);
exports.EventComponent = EventComponent;
//# sourceMappingURL=event.component.js.map