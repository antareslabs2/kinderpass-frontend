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
        this.isAuthorized = false;
        this.openPopup = false;
        this.resultsToShow = 1;
        this.monday = new Date();
        this.selectedDate = new Date().toDateString();
        this.events = [];
        this.dates = [];
        this.months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        this.ages = [[0, 2], [3, 5], [6, 9], [10, 14]];
        this.times = [
            {
                "key": "День",
                "time_from": 0,
                "time_to": 12
            },
            {
                "key": "Вечер",
                "time_from": 13,
                "time_to": 24
            },
            {
                "key": "Весь день",
                "time_from": 0,
                "time_to": 24
            }
        ];
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.httpService.getInfo().subscribe(function (data) {
            if (data.status == 'ERROR') {
                _this.isAuthorized = false;
            }
            else {
                _this.isAuthorized = true;
            }
        });
        var d = new Date();
        this.weekday = d.getDay() - 1;
        this.curDate = d.getFullYear().toString() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2);
        this.initSlider();
        this.httpService.getCategories().subscribe(function (data) {
            _this.categories = data.categories;
            _this.curCategory = _this.categories.filter(function (item) { return item.name === 'Киндерпасс'; })[0]['id'];
            _this.httpService.getSchedule(_this.curCategory, _this.curDate, {}).subscribe(function (data) {
                if (data.results > 0) {
                    _this.events = data;
                }
            });
        });
        // 
        var day = this.monday.getDay() || 7;
        if (day !== 1)
            this.monday.setHours(-24 * (day - 1));
        // 
        this.initDates();
    };
    AppComponent.prototype.initDates = function () {
        this.dates[0] = {
            "date": this.monday.toDateString(),
            "filter": this.monday.getFullYear().toString() + ("0" + (this.monday.getMonth() + 1)).slice(-2) + ("0" + this.monday.getDate()).slice(-2),
            "month": this.monday.getDate() + ' ' + this.months[this.monday.getMonth()]
        };
        for (var i = 1; i < 7; i++) {
            var d = new Date(this.monday);
            d.setDate(d.getDate() + i);
            this.dates[i] = {
                "date": d.toDateString(),
                "filter": d.getFullYear().toString() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2),
                "month": d.getDate() + ' ' + this.months[d.getMonth()]
            };
        }
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
    AppComponent.prototype.filterByDate = function (event) {
        var _this = this;
        if ($(event.target).hasClass('week-day')) {
            $(event.target).siblings().removeClass('filters-option-active');
            $(event.target).addClass('filters-option-active');
        }
        else {
            $(event.target).parents('.week-day').siblings().removeClass('filters-option-active');
            $(event.target).parents('.week-day').addClass('filters-option-active');
        }
        this.httpService.getSchedule(this.curCategory, this.curDate, {}).subscribe(function (data) {
            if (data.results > 0) {
                _this.events = data;
            }
            _this.resultsToShow = 1;
        });
    };
    AppComponent.prototype.filterByOption = function (event) {
        var _this = this;
        var getParams = {};
        if (this.age_from != undefined)
            getParams.age_from = this.age_from;
        if (this.age_to != undefined)
            getParams.age_to = this.age_to;
        if (this.time_from != undefined)
            getParams.time_from = this.time_from;
        if (this.time_to != undefined)
            getParams.time_to = this.time_to;
        $(event.target).siblings().removeClass('filters-option-active');
        $(event.target).addClass('filters-option-active');
        this.httpService.getSchedule(this.curCategory, this.curDate, getParams).subscribe(function (data) {
            if (data.results > 0) {
                _this.events = data;
            }
            _this.resultsToShow = 1;
        });
    };
    AppComponent.prototype.nextWeek = function (event) {
        this.monday.setDate(this.monday.getDate() + 7);
        this.initDates();
    };
    AppComponent.prototype.lastWeek = function (event) {
        this.monday.setDate(this.monday.getDate() - 7);
        this.initDates();
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