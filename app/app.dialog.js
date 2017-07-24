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
var animations_1 = require("@angular/animations");
var app_global_service_1 = require("./app.global.service");
var DialogComponent = (function () {
    function DialogComponent(gs, _window) {
        this.gs = gs;
        this._window = _window;
        if (this._window.location.hostname == 'kinderpass.ru')
            this.apiURL = 'https://api.kinderpass.ru/';
        else if (this._window.location.hostname == 'dev.kinderpass.ru')
            this.apiURL = 'http://dev.kinderpass.ru:8000/';
        else
            this.apiURL = 'https://test.kinderpass.ru/';
    }
    DialogComponent.prototype.close = function () {
        this.gs.popupName = '';
        $("html").removeClass('locked');
    };
    DialogComponent.prototype.update = function (form) {
        this.gs.update(form);
    };
    return DialogComponent;
}());
DialogComponent = __decorate([
    core_1.Component({
        selector: 'app-dialog',
        templateUrl: 'static/loginPopup.html',
        animations: [
            animations_1.trigger('dialog', [
                animations_1.transition('void => *', [
                    animations_1.animate(300, animations_1.style({ opacity: '1' }))
                ]),
                animations_1.transition('* => void', [
                    animations_1.animate(300, animations_1.style({ opacity: '0' }))
                ])
            ])
        ]
    }),
    __param(1, core_1.Inject(Window)),
    __metadata("design:paramtypes", [app_global_service_1.GlobalService, Window])
], DialogComponent);
exports.DialogComponent = DialogComponent;
//# sourceMappingURL=app.dialog.js.map