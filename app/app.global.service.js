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
var forms_1 = require("@angular/forms");
var GlobalService = (function () {
    function GlobalService(httpService, fb) {
        this.httpService = httpService;
        this.fb = fb;
        this.userInfo = {};
        this.isAuthenticated = false;
        this.popupName = '';
        this.getUserInfo();
        this.innerpage = false;
        this.msg = '';
        this.email = '';
        this.phone = '';
        this.phoneMask = ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
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
                            _this.msg = "Платеж отклонен";
                            _this.popupName = 'msgCancel';
                            localStorage.removeItem('transaction.id');
                        }
                        else if (data.transaction.status == 'I') {
                            _this.msg = "Завершите процедуру оплаты";
                            _this.popupName = 'msgCancel';
                            localStorage.removeItem('transaction.id');
                        }
                        else if (data.transaction.status == 'C') {
                            _this.msg = "Оплата прошла успешно";
                            _this.popupName = 'msg';
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
            this.phone = this.userInfo.phone;
            this.contactsForm = this.fb.group({
                'email': [this.email, [
                        forms_1.Validators.required,
                        forms_1.Validators.pattern("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
                    ]
                ],
                'phone': [this.phone, [
                        forms_1.Validators.required,
                    ]
                ]
            });
            if (!this.userInfo.phone || !this.userInfo.email)
                this.popupName = 'updateInfo';
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
        this.phone = form.controls.phone.value;
        if (this.email && this.phone) {
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
                }
            });
        }
    };
    return GlobalService;
}());
GlobalService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.Api, forms_1.FormBuilder])
], GlobalService);
exports.GlobalService = GlobalService;
//# sourceMappingURL=app.global.service.js.map