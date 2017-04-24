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
        this.testqq = 10000;
        this.selectedEvent = {};
        this.isAuthenticated = false;
        this.openPopup = '';
        this.resultsToShow = 8;
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
        this.districtIDs = [];
        this.metroIDs = [];
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.httpService.getInfo().subscribe(function (data) {
            console.log(data);
            if (data.status == 'ERROR') {
                _this.isAuthenticated = false;
                _this.initSlider();
            }
            else {
                _this.isAuthenticated = true;
            }
        });
        var d = new Date();
        this.weekday = d.getDay() - 1;
        this.curDate = d.getFullYear().toString() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2);
        this.httpService.getCategories().subscribe(function (data) {
            _this.categories = data.categories;
            _this.curCategory = _this.categories.filter(function (item) { return item.name === 'Киндерпасс'; })[0]['id'];
            _this.httpService.getSchedule(_this.curCategory, _this.curDate, {}).subscribe(function (data) {
                if (data.results > 0) {
                    _this.parseActivities(data);
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
        if ($(event.target).hasClass('week-day')) {
            $(event.target).siblings().removeClass('filters-option-active');
            $(event.target).addClass('filters-option-active');
        }
        else {
            $(event.target).parents('.week-day').siblings().removeClass('filters-option-active');
            $(event.target).parents('.week-day').addClass('filters-option-active');
        }
        this.eventsFilter();
    };
    AppComponent.prototype.filterByOption = function (event) {
        $(event.target).siblings().removeClass('filters-option-active');
        $(event.target).addClass('filters-option-active');
        this.eventsFilter();
    };
    AppComponent.prototype.eventsFilter = function () {
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
        if (this.districtIDs.length > 0)
            getParams.district_ids = this.districtIDs;
        if (this.metroIDs.length > 0)
            getParams.metro_ids = this.metroIDs;
        this.httpService.getSchedule(this.curCategory, this.curDate, getParams).subscribe(function (data) {
            _this.events = [];
            if (data.results > 0) {
                _this.parseActivities(data);
            }
            _this.resultsToShow = 8;
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
    AppComponent.prototype.parseActivities = function (data) {
        for (var item in data.activities) {
            for (var location_1 in data.activities[item].locations) {
                for (var time in data.activities[item].locations[location_1].time_slots) {
                    this.events.push({
                        'id': data.activities[item].id,
                        'name': data.activities[item].name,
                        'description': data.activities[item].description,
                        'photo': data.activities[item].photo,
                        'duration': data.activities[item].duration,
                        'locations': {
                            'id': data.activities[item].locations[location_1].id,
                            'address': data.activities[item].locations[location_1].address,
                            'latitude': data.activities[item].locations[location_1].latitude,
                            'longitude': data.activities[item].locations[location_1].longitude,
                            'time_slots': {
                                'id': data.activities[item].locations[location_1].time_slots[time].id,
                                'date': data.activities[item].locations[location_1].time_slots[time].date,
                                'start_time': data.activities[item].locations[location_1].time_slots[time].start_time,
                                'end_time': data.activities[item].locations[location_1].time_slots[time].end_time,
                                'free_seats': data.activities[item].locations[location_1].time_slots[time].free_seats,
                                'allocated_seats': data.activities[item].locations[location_1].time_slots[time].allocated_seats,
                                'price': data.activities[item].locations[location_1].time_slots[time].price
                            }
                        },
                        'provider': {
                            'id': data.activities[item].provider.id,
                            'name': data.activities[item].provider.name
                        }
                    });
                }
            }
        }
    };
    AppComponent.prototype.districtsFilter = function (districts) {
        this.districtIDs = districts;
        this.metroIDs = [];
        this.eventsFilter();
    };
    AppComponent.prototype.metroFilter = function (metro) {
        this.districtIDs = [];
        this.metroIDs = metro;
        this.eventsFilter();
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