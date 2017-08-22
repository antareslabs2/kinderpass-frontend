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
var app_global_service_1 = require("./app.global.service");
var common_1 = require("@angular/common");
var moment = require("moment");
var BookingsComponent = (function () {
    function BookingsComponent(httpService, gs, _location) {
        this.httpService = httpService;
        this.gs = gs;
        this._location = _location;
        this.innerpage = true;
        this.bookings = [];
    }
    BookingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.gs.isAuthenticated && this.gs.userInfo.bookings) {
            this.parseBookings(this.gs.userInfo.bookings);
        }
        else {
            this.httpService.getInfo().subscribe(function (data) {
                _this.parseBookings(data.bookings);
            });
        }
    };
    BookingsComponent.prototype.parseBookings = function (bookingIds) {
        var _this = this;
        var today = moment(new Date()).format();
        for (var booking in bookingIds) {
            this.httpService.getBookingById(bookingIds[booking].id).subscribe(function (data) {
                if (data.activity) {
                    var date = moment(data.activity.time_slot.date.replace(/(\d+).(\d+).(\d+)/, '$3-$2-$1')).add(data.activity.time_slot.start_time.split(':')[0], 'h').format();
                    data.activity.time_slot.date = date;
                    data.activity.days_to_event = moment(date).diff(today, 'days');
                    data.activity.time_to_event = moment(date).diff(today, 'hours') - data.activity.days_to_event * 24;
                    _this.bookings.push(data.activity);
                }
            });
        }
    };
    BookingsComponent.prototype.cancelBooking = function (bookingId) {
        var _this = this;
        console.log(bookingId);
        this.httpService.cancelBooking(bookingId).subscribe(function (data) {
            if (data.status == "OK") {
                _this.gs.msg = "Ваше бронирование успешно отменено";
                _this.gs.getUserInfo();
                // this.loadBooking();
                _this.gs.openPopup('goToUrl');
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
        });
        ;
    };
    BookingsComponent.prototype.goBack = function () {
        this._location.back();
    };
    return BookingsComponent;
}());
BookingsComponent = __decorate([
    core_1.Component({
        selector: 'bookings',
        templateUrl: "../static/bookings.html?v=" + new Date().getTime(),
        providers: [api_service_1.Api]
    }),
    __metadata("design:paramtypes", [api_service_1.Api, app_global_service_1.GlobalService, common_1.Location])
], BookingsComponent);
exports.BookingsComponent = BookingsComponent;
//# sourceMappingURL=bookings.component.js.map