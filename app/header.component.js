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
var core_1 = require("@angular/core");
var app_global_service_1 = require("./app.global.service");
var router_1 = require("@angular/router");
var ng2_page_scroll_1 = require("ng2-page-scroll");
var platform_browser_1 = require("@angular/platform-browser");
var HeaderComponent = (function () {
    function HeaderComponent(gs, router, pageScrollService, document) {
        this.gs = gs;
        this.pageScrollService = pageScrollService;
        this.document = document;
        this.openProfile = false;
        var th = this;
        $(document).click(function (e) {
            if (th.openProfile) {
                var profile = $(".user-menu");
                var button = $(".user");
                if (!profile.is(e.target) && profile.has(e.target).length === 0 && !button.is(e.target) && button.has(e.target).length === 0) {
                    th.openProfile = false;
                }
            }
        });
    }
    HeaderComponent.prototype.logout = function () {
        this.gs.logout();
        this.openProfile = false;
    };
    HeaderComponent.prototype.toogleLK = function () {
        this.openProfile = !this.openProfile;
    };
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    core_1.Component({
        selector: 'headerTemplate',
        templateUrl: "static/header.html?v=" + new Date().getTime()
    }),
    __param(3, core_1.Inject(platform_browser_1.DOCUMENT)),
    __metadata("design:paramtypes", [app_global_service_1.GlobalService, router_1.Router, ng2_page_scroll_1.PageScrollService, Object])
], HeaderComponent);
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map