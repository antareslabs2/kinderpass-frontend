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
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var moment = require("moment");
var GlobalService = (function () {
    function GlobalService(httpService, fb, _window, _location) {
        this.httpService = httpService;
        this.fb = fb;
        this._window = _window;
        this._location = _location;
        this.userInfo = {};
        this.isAuthenticated = false;
        this.popupName = '';
        this.getUserInfo();
        this.innerpage = false;
        this.msg = '';
        this.email = '';
        this.phone = '';
        this.phoneMask = ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        this.extendSubscription = false;
        this.newSubscription = false;
        this.policy = false;
        this.url = {};
        this.fragment = '';
    }
    GlobalService.prototype.openPopup = function (name) {
        this.popupName = name;
        $("html").addClass('locked');
    };
    GlobalService.prototype.getUserInfo = function () {
        var _this = this;
        this.httpService.getInfo().subscribe(function (data) {
            _this.parseUserInfo(data);
        });
    };
    GlobalService.prototype.parseUserInfo = function (data) {
        var _this = this;
        var th = this;
        if (data.status == 'ERROR') {
            this.isAuthenticated = false;
            this.userInfo = {};
        }
        else {
            if (localStorage.getItem('transaction.id'))
                this.httpService.checkTransaction(localStorage.getItem('transaction.id')).subscribe(function (data) {
                    if (data.status = "OK") {
                        if (data.transaction.status == 'F') {
                            if (localStorage.getItem('timeslot_id'))
                                _this.msg = "Не удалось осуществить бронирование. Платеж отклонен. Попробуйте еще раз";
                            else
                                _this.msg = "Платеж отклонен";
                            _this.openPopup('msgCancel');
                            localStorage.removeItem('transaction.id');
                            localStorage.removeItem('timeslot_id');
                            localStorage.removeItem('seats');
                        }
                        else if (data.transaction.status == 'I') {
                            _this.msg = "Завершите процедуру оплаты";
                            _this.openPopup('msgCancel');
                            localStorage.removeItem('transaction.id');
                        }
                        else if (data.transaction.status == 'C') {
                            if (localStorage.getItem('timeslot_id')) {
                                var timeslot = +localStorage.getItem('timeslot_id');
                                var seats = JSON.parse(localStorage.getItem('seats'));
                                _this.httpService.makingBooking(timeslot, seats).subscribe(function (data) {
                                    if (data.status == "OK") {
                                        _this.booking_id = data.booking_id;
                                        _this.getUserInfo();
                                        _this.openPopup('booking');
                                    }
                                    else {
                                        if (data.reason == "TIME_SLOT_REGISTRATION_IS_OVER") {
                                            _this.msg = "Завершено бронирование мест на выбранное мероприятие";
                                        }
                                        else {
                                            _this.msg = "Что-то пошло не так. Попробуйте обновить страницу";
                                        }
                                        _this.openPopup('msgCancel');
                                    }
                                    localStorage.removeItem('timeslot_id');
                                    localStorage.removeItem('seats');
                                });
                            }
                            else {
                                _this.newSubscription = true;
                            }
                            localStorage.removeItem('transaction.id');
                            _this.getUserInfo();
                        }
                    }
                    else {
                        localStorage.removeItem('transaction.id');
                    }
                });
            this.userInfo = data;
            this.isAuthenticated = true;
            this.email = this.userInfo.email;
            this.phone = this.userInfo.phone.split("+7")[1];
            this.policy = !!(this.userInfo.email && this.userInfo.phone);
            this.contactsForm = this.fb.group({
                'email': [this.email, [
                        forms_1.Validators.required,
                        forms_1.Validators.pattern("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
                    ]
                ],
                'phone': [this.phone, [
                        forms_1.Validators.required,
                        this.phoneValidation
                    ]
                ],
                'policy': [this.policy, [forms_1.Validators.required, forms_1.Validators.pattern('true')]
                ]
            });
            if (!this.userInfo.phone || !this.userInfo.email) {
                this.popupName = 'updateInfo';
                this.policy = false;
            }
            else if (this.userInfo.subscription) {
                var today = moment(new Date()).add(7, 'days').format();
                var subscription = moment(new Date(this.userInfo.subscription.expires_at.replace(/(\d+).(\d+).(\d+)/, '$3-$2-$1'))).format();
                if (moment(today).isAfter(subscription, 'day'))
                    this.extendSubscription = true;
                else
                    this.extendSubscription = false;
                this.policy = true;
            }
            else {
                this.popupName = "extendSubscription";
                this.extendSubscription = true;
                this.policy = true;
            }
            var th_1 = this;
            window.onload = function () {
                if (yaCounter44744683) {
                    console.log(th_1.userInfo.id);
                    yaCounter44744683.userParams({ UserId: th_1.userInfo.id, UserName: th_1.userInfo.name });
                }
                ga('set', 'userId', th_1.userInfo.id);
                ga('send', 'pageview', '/virtual/auth');
                if (th_1._window.location.hostname == 'kinderpass.ru')
                    ga('send', 'event', 'Main', 'user_auth_' + th_1.userInfo.id, 'Prod');
                else if (th_1._window.location.hostname == 'front.kinderpass.ru')
                    ga('send', 'event', 'Main', 'user_auth_' + th_1.userInfo.id, 'Test');
            };
        }
    };
    GlobalService.prototype.logout = function () {
        var _this = this;
        this.httpService.logout().subscribe(function (data) {
            _this.getUserInfo();
        });
    };
    GlobalService.prototype.update = function (form) {
        var _this = this;
        this.email = form.controls.email.value;
        this.phone = '+7' + form.controls.phone.value.replace(/[^0-9]+/g, "");
        this.policy = form.controls.policy.value;
        var length = this.phone.length;
        if (this.email && this.phone && this.policy && length == 12) {
            var body = {
                phone: this.phone,
                email: this.email
            };
            this.httpService.updateInfo(JSON.stringify(body)).subscribe(function (data) {
                if (data.phone && data.email) {
                    _this.popupName = '';
                    $("html").removeClass('locked');
                    _this.userInfo.phone = _this.phone;
                    _this.userInfo.email = _this.email;
                    _this.policy = true;
                    ga('send', 'pageview', '/virtual/mailphonesaved');
                }
            });
        }
    };
    GlobalService.prototype.initTransaction = function (type, amount) {
        this.httpService.initTransaction(type, amount).subscribe(function (data) {
            if (data.status == 'OK') {
                localStorage.setItem('transaction.id', JSON.stringify(data.transaction.id));
                window.location.href = data.alfa.formUrl;
            }
        });
    };
    GlobalService.prototype.phoneValidation = function (input) {
        if (input.value) {
            return input.value.replace(/[^0-9]+/g, "").length == 10 ? null : { needsExclamation: true };
        }
    };
    GlobalService.prototype.openLoginPopup = function () {
        this.openPopup('login');
        ga('send', 'pageview', '/virtual/openauth');
        if (this._window.location.hostname == 'kinderpass.ru')
            ga('send', 'event', 'Main', 'OpenAuthPopup', 'Prod');
        else if (this._window.location.hostname == 'front.kinderpass.ru')
            ga('send', 'event', 'Main', 'OpenAuthPopup', 'Test');
    };
    GlobalService.prototype.declOfNum = function (number, titles) {
        var cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    };
    GlobalService.prototype.goBack = function () {
        this._location.back();
    };
    return GlobalService;
}());
GlobalService = __decorate([
    core_1.Injectable(),
    __param(2, core_1.Inject(Window)),
    __metadata("design:paramtypes", [api_service_1.Api, forms_1.FormBuilder, Window, common_1.Location])
], GlobalService);
exports.GlobalService = GlobalService;
//# sourceMappingURL=app.global.service.js.map