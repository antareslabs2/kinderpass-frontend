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
var animations_1 = require("@angular/animations");
var app_global_service_1 = require("./app.global.service");
var DialogComponent = (function () {
    function DialogComponent(gs) {
        this.gs = gs;
        if (window.location.hostName == 'kinderpass.ru')
            this.apiURL = 'http://api.kinderpass.ru/';
        else
            this.apiURL = 'http://test.kinderpass.ru/';
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
    __metadata("design:paramtypes", [app_global_service_1.GlobalService])
], DialogComponent);
exports.DialogComponent = DialogComponent;
//# sourceMappingURL=app.dialog.js.map