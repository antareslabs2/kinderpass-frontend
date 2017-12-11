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
var app_global_service_1 = require("./app.global.service");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var api_service_1 = require("./api.service");
var SubscriptionComponent = (function () {
    function SubscriptionComponent(httpService, fb, route, gs) {
        this.httpService = httpService;
        this.fb = fb;
        this.route = route;
        this.gs = gs;
        this.gs.innerpage = true;
        this.innerpage = true;
        this.submitted = false;
        this.subscriptions = {
            once_a_week: {
                name: 'Раз в неделю',
                events: 'Восемь',
                days: 'Один раз в неделю',
                price: 4990
            },
            weekends: {
                name: 'Только выходные',
                events: 'Двенадцать',
                days: 'Каждые выходные',
                price: 7900
            },
            week: {
                name: 'Выходные и будние',
                events: 'Восемнадцать',
                days: 'В будние и выходные',
                price: 9990
            }
        };
    }
    SubscriptionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptionForm = this.fb.group({
            'cardNumber': ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern("^\\d+$")])],
            'cardOwner': ['', forms_1.Validators.compose([forms_1.Validators.required])],
            'cardMonth': ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern("^\\d+$")])],
            'cardYear': ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern("^\\d+$")])],
            'name': ['', forms_1.Validators.compose([forms_1.Validators.required])],
            'email': ['', forms_1.Validators.compose([forms_1.Validators.required])],
            'phone': ['', forms_1.Validators.compose([forms_1.Validators.required])],
        });
        this.route.params.subscribe(function (params) {
            _this.subscription = _this.subscriptions[params['type']];
        });
    };
    SubscriptionComponent.prototype.submit = function (form) {
        this.submitted = true;
        if (form.valid) {
            var body = {
                cardNumber: form.controls.cardNumber.value,
                cardOwner: form.controls.cardOwner.value,
                cardMonth: form.controls.cardMonth.value,
                cardYear: form.controls.cardYear.value,
                name: form.controls.name.value,
                email: form.controls.email.value,
                phone: form.controls.phone.value
            };
            var data = $('#form').serialize();
            var url = "https://script.google.com/macros/s/AKfycbymBGojkg7qLn2XP7VL3ksRZ-OLuP0qglIA_1VJSFLGWiltTNyQ/exec";
            var th_1 = this;
            $.ajax({
                url: url,
                type: 'POST',
                data: data,
                success: function (resp) {
                    th_1.gs.popupName = "msg";
                    th_1.gs.msg = "Спасибо за заявку. Наш менеджер свяжется с Вами в ближайшее время";
                },
                error: function () {
                },
            });
        }
    };
    return SubscriptionComponent;
}());
SubscriptionComponent = __decorate([
    core_1.Component({
        selector: 'subscribtion',
        templateUrl: "../static/subscription.html?v=" + new Date().getTime(),
    }),
    __metadata("design:paramtypes", [api_service_1.Api, forms_1.FormBuilder, router_1.ActivatedRoute, app_global_service_1.GlobalService])
], SubscriptionComponent);
exports.SubscriptionComponent = SubscriptionComponent;
//# sourceMappingURL=subscription.component.js.map