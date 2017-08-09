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
var BookingComponent = (function () {
    function BookingComponent(httpService, route, gs) {
        this.httpService = httpService;
        this.route = route;
        this.gs = gs;
        this.innerpage = true;
    }
    BookingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            _this.booking_id = +params['id'];
            _this.loadBooking();
        });
    };
    BookingComponent.prototype.loadBooking = function () {
        var _this = this;
        this.httpService.getBookingById(this.booking_id).subscribe(function (data) {
            if (data.activity) {
                _this.event = data.activity;
            }
        });
    };
    BookingComponent.prototype.cancelBooking = function (timeSlotID) {
        var _this = this;
        this.httpService.cancelBooking(timeSlotID).subscribe(function (data) {
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
    BookingComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    return BookingComponent;
}());
BookingComponent = __decorate([
    core_1.Component({
        selector: 'booking',
        templateUrl: "static/booking.html?v=" + new Date().getTime(),
        providers: [api_service_1.Api]
    }),
    __metadata("design:paramtypes", [api_service_1.Api, router_1.ActivatedRoute, app_global_service_1.GlobalService])
], BookingComponent);
exports.BookingComponent = BookingComponent;
//# sourceMappingURL=booking.component.js.map