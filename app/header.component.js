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
var app_global_service_1 = require("./app.global.service");
var HeaderComponent = (function () {
    function HeaderComponent(gs) {
        this.gs = gs;
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
    HeaderComponent.prototype.onResize = function (event) {
        if ($('.advantages-slider').length) {
            if (event.target.innerWidth <= 420) {
                if (!$('.advantages-slider').hasClass('slick-initialized')) {
                    $('.advantages-slider').slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false,
                        dots: true
                    });
                }
            }
            else {
                if ($('.advantages-slider').hasClass('slick-initialized')) {
                    $('.advantages-slider').slick('unslick');
                }
            }
        }
        if ($('.steps-wrap').length) {
            if (event.target.innerWidth <= 420) {
                if (!$('.steps-wrap').hasClass('slick-initialized')) {
                    $('.steps-wrap').slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false,
                        dots: true
                    });
                }
            }
            else {
                if ($('.steps-wrap').hasClass('slick-initialized')) {
                    $('.steps-wrap').slick('unslick');
                }
            }
        }
    };
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    core_1.Component({
        selector: 'headerTemplate',
        templateUrl: 'header.html',
        host: {
            '(window:resize)': 'onResize($event)'
        }
    }),
    __metadata("design:paramtypes", [app_global_service_1.GlobalService])
], HeaderComponent);
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map