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
var app_global_service_1 = require("./app.global.service");
var RegistrationComponent = (function () {
    function RegistrationComponent(httpService, gs) {
        this.httpService = httpService;
        this.gs = gs;
        this.opf = 'ООО';
        this.openPopup = '';
        this.msg = '';
        this.innerpage = true;
        this.o_id = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.o_tid = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.o_kpp = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.ie_id = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.ie_tid = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.bank_cacc = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
        this.phone = ['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    }
    RegistrationComponent.prototype.submit = function (event) {
        var invalidFields = this.validateForm(event.target.parentElement);
        if (invalidFields.length == 0) {
            var data_1 = $(event.target.parentElement).serialize();
            var url = "https://script.google.com/macros/s/AKfycbzLz5xJS2x726J14D04DOYNyuuhIRrAqXlRlaJTf7sYSgoQcfE/exec";
            $.ajax({
                url: url,
                type: 'POST',
                data: data_1,
                success: function (resp) {
                    $.ajax({
                        url: './offer-application/offer-gen.php',
                        type: 'POST',
                        data: data_1,
                        success: function (resp) {
                            var w = window.open('about:blank', '_blank');
                            w.document.write(resp);
                            w.document.close();
                        },
                        error: function (resp) {
                            console.log(resp);
                        },
                    });
                },
                error: function () {
                },
            });
        }
        else {
            this.gs.popupName = 'msgCancel';
            if (invalidFields.length == 1) {
                this.gs.msg = 'Вы неправильно заполнили поле ' + invalidFields[0] + '. Пожалуйста, исправьте ошибку и отправьте заявку еше раз.';
            }
            else {
                this.gs.msg = 'Вы неправильно заполнили поля ' + invalidFields.join(', ') + '. Пожалуйста, исправьте ошибки и отправьте заявку еше раз.';
            }
        }
    };
    RegistrationComponent.prototype.validateForm = function (form) {
        var result = [];
        if ($('input[name=opf]:checked').val() == "ООО") {
            for (var d in $('#llc').children()) {
                var c2 = $('#llc').children()[d];
                if (c2.name == 'o_id') {
                    if (c2.value.indexOf('_') > -1 || c2.value.length < 13) {
                        result.push('ОГРН');
                    }
                    continue;
                }
                if (c2.name == 'o_tid') {
                    if (c2.value.indexOf('_') > -1 || c2.value.length < 10) {
                        result.push('ИНН');
                    }
                    continue;
                }
                if (c2.name == 'o_kpp') {
                    if (c2.value.indexOf('_') > -1 || c2.value.length < 9) {
                        result.push('КПП');
                    }
                    continue;
                }
                if (c2.type == "text") {
                    if (c2.value.length < 5) {
                        result.push(c2.placeholder);
                    }
                    continue;
                }
            }
        }
        else if ($('input[name=opf]:checked').val() == "ИП") {
            for (var d in $('#ie').children()) {
                var c2 = $('#ie').children()[d];
                if (c2.name == 'ie_id') {
                    if (c2.value.indexOf('_') > -1 || c2.value.length < 15) {
                        result.push('ОГРНИП');
                    }
                    continue;
                }
                if (c2.name == 'ie_tid') {
                    if (c2.value.indexOf('_') > -1 || c2.value.length < 12) {
                        result.push('ИНН');
                    }
                    continue;
                }
                if (c2.type == "text") {
                    if (c2.value.length < 5) {
                        result.push(c2.placeholder);
                    }
                    continue;
                }
            }
        }
        for (var c in $(form).children()) {
            var child = $(form).children()[c];
            if (child.name == 'bank_pacc') {
                if (child.value.indexOf('_') > -1 || child.value.length < 20) {
                    result.push('Расчетный счет');
                }
                continue;
            }
            if (child.name == 'bank_cacc') {
                if (child.value.indexOf('_') > -1 || child.value.length < 20) {
                    result.push('Корр. счет');
                }
                continue;
            }
            if (child.name == 'bank_id') {
                if (child.value.indexOf('_') > -1 || child.value.length < 9) {
                    result.push('БИК');
                }
                continue;
            }
            if (child.name == 'phone') {
                if (child.value.indexOf('_') > -1 || child.value.length < 1) {
                    result.push('Телефон');
                }
                continue;
            }
            if (child.name == 'email') {
                if (child.value.length < 5 || child.value.indexOf('@') < 0 || child.value.indexOf('.') < 0) {
                    result.push('e-mail');
                }
                continue;
            }
            // all other lengths
            if (child.type == "text") {
                if (child.value.length < 3) {
                    result.push(child.placeholder);
                }
                continue;
            }
        }
        return result;
    };
    return RegistrationComponent;
}());
RegistrationComponent = __decorate([
    core_1.Component({
        selector: 'registration',
        templateUrl: "static/registration.html?v=" + new Date().getTime(),
        providers: [api_service_1.Api],
        styles: ["\n\t\tinput.ng-touched.ng-invalid {border:solid red 2px;}\n\t\tinput.ng-touched.ng-valid {border:solid green 2px;}\n\t"]
    }),
    __metadata("design:paramtypes", [api_service_1.Api, app_global_service_1.GlobalService])
], RegistrationComponent);
exports.RegistrationComponent = RegistrationComponent;
//# sourceMappingURL=registration.component.js.map