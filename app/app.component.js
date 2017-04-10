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
var http_service_1 = require("./http.service");
var $ = require("jquery");
require("slick");
var AppComponent = (function () {
    function AppComponent(httpService) {
        this.httpService = httpService;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.date = new Date().toLocaleString('ru');
        ;
        this.initSlider();
        this.httpService.getCategories().subscribe(function (data) { _this.categories = data.categories; });
    };
    AppComponent.prototype.initSlider = function () {
        if ($('.slider').length) {
            $('.slider').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                dots: true,
                fade: true,
                prevArrow: $('.slider-arrow-prev'),
                nextArrow: $('.slider-arrow-next')
            });
        }
        if ($('.advantages-slider').length) {
            if ($(window).width() <= 420) {
                $('.advantages-slider').slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true
                });
            }
            else {
                if ($('.advantages-slider').hasClass('slick-initialized')) {
                    $('.advantages-slider').slick('unslick');
                }
            }
        }
        if ($('.steps-wrap').length) {
            if ($(window).width() <= 420) {
                $('.steps-wrap').slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true
                });
            }
            else {
                if ($('.steps-wrap').hasClass('slick-initialized')) {
                    $('.steps-wrap').slick('unslick');
                }
            }
        }
    };
    AppComponent.prototype.onResize = function (event) {
        if ($('.advantages-slider').length) {
            if ($(window).width() <= 420) {
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
            if ($(window).width() <= 420) {
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
    AppComponent.prototype.schedule = function (event) {
        $(event.target).toggleClass('filters-option-active');
        this.category = $(event.target).data('id');
        this.httpService.getSchedule(this.category, $('.week-day-active').data('date')).subscribe(function (data) { console.log(data); });
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        templateUrl: 'main.html',
        // styleUrls: ['app/js/slick/slick.css', 'app/js/slick/slick-theme.css', 'app/css/styles.css' ],
        providers: [http_service_1.HttpService],
        host: {
            '(window:resize)': 'onResize($event)'
        }
    }),
    __metadata("design:paramtypes", [http_service_1.HttpService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map