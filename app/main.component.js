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
var api_service_1 = require("./api.service");
var app_global_service_1 = require("./app.global.service");
var router_1 = require("@angular/router");
var ng2_page_scroll_1 = require("ng2-page-scroll");
var platform_browser_1 = require("@angular/platform-browser");
var moment = require("moment");
var $ = require("jquery");
var MainComponent = (function () {
    function MainComponent(httpService, router, gs, pageScrollService, document) {
        this.httpService = httpService;
        this.router = router;
        this.gs = gs;
        this.pageScrollService = pageScrollService;
        this.document = document;
        this.hash = '';
        this.gs.innerpage = false;
        this.monday = new Date();
        this.today = new Date();
        this.nextMonth = moment(this.today).add(1, 'month').format();
        this.selectedDate = new Date();
        this.events = [];
        this.dates = [];
        this.months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        this.ages = [[0, 2], [3, 5], [6, 9], [10, 14]];
        this.times = [
            {
                "key": "День",
                "time_from": 8,
                "time_to": 16
            },
            {
                "key": "Вечер",
                "time_from": 17,
                "time_to": 23
            },
            {
                "key": "Весь день",
                "time_from": 8,
                "time_to": 23
            }
        ];
        this.params = {
            'age_from': null,
            'age_to': null,
            'time_from': 8,
            'time_to': 23,
            'districts': {},
            'metro': {}
        };
        this.districts = {};
        this.metro = {};
        this.districtsNames = ["Адмиралтейский", "Василеостровский", "Выборгский", "Калининский", "Кировский", "Колпинский", "Красногвардейский", "Красносельский", "Кронштадтский", "Курортный", "Московский", "Невский", "Петроградский", "Петродворцовый", "Приморский", "Пушкинский", "Фрунзенский", "Центральный", "Павловский", "Ломоносовский"];
        this.metroStations = ["Ладожская", "Проспект Большевиков", "Улица Дыбенко", "Елизаровская", "Ломоносовская", "Пролетарская", "Обухово", "Рыбацкое", "Новочеркасская", "Лиговский проспект", "Площадь Александра Невского 2", "Площадь Александра Невского 1", "Бухарестская", "Международная", "Волковская", "Обводный канал 1", "Фрунзенская", "Московские ворота", "Электросила", "Парк Победы", "Московская", "Звездная", "Купчино", "Звенигородская", "Пушкинская", "Владимировская", "Достоевская", "Спасская", "Маяковская", "Гостиный двор", "Площадь Восстания", "Садовая", "Сенная площадь", "Технологический институт 1", "Технологический институт 2", "Невский проспект", "Балтийская", "Кировский завод", "Нарвская", "Автово", "Ленинский проспект", "Проспект Ветеранов", "Адмиралтейская", "Василеостровская", "Приморская", "Спортивная", "Чкаловская", "Горьковская", "Петроградская", "Черная речка", "Пионерская", "Удельная", "Крестовский остров", "Комендантский проспект", "Старая деревня", "Озерки", "Парнас", "Проспект просвещения", "Площадь Мужества", "Политехническая", "Академическая", "Гражданский проспект", "Девяткино", "Чернышевская", "Площадь Ленина", "Выборгская", "Лесная"];
        this.categories = [{ id: 0, name: "Все" }];
    }
    MainComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.gs.innerpage = false;
        for (var i in this.districtsNames) {
            var tmp = {};
            this.districts[this.districtsNames[i]] = {
                'selected': false,
                'active': false
            };
        }
        this.httpService.getDistricts().subscribe(function (data) {
            for (var i in data.districts) {
                if (_this.districts.hasOwnProperty(data.districts[i].name)) {
                    _this.districts[data.districts[i].name].active = true;
                    _this.districts[data.districts[i].name].id = data.districts[i].id;
                    if (_this.params.districts.id && _this.params.districts.id.indexOf(data.districts[i].id) != -1) {
                        _this.districts[data.districts[i].name].selected = true;
                        _this.params.districts.name.push(data.districts[i].name);
                    }
                }
            }
        });
        for (var i in this.metroStations) {
            var tmp = {};
            this.metro[this.metroStations[i]] = {
                'selected': false,
                'active': false
            };
        }
        this.httpService.getMetro().subscribe(function (data) {
            for (var i in data.metro) {
                if (_this.metro.hasOwnProperty(data.metro[i].name)) {
                    _this.metro[data.metro[i].name].active = true;
                    _this.metro[data.metro[i].name].id = data.metro[i].id;
                    if (_this.params.metro.id && _this.params.metro.id.indexOf(data.metro[i].id) != -1) {
                        _this.metro[data.metro[i].name].selected = true;
                        _this.params.metro.name.push(data.metro[i].name);
                    }
                }
            }
        });
        if (location.search) {
            var search = location.search.substring(1);
            var vars = search.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (pair[0] in this.params) {
                    this.params[pair[0]] = pair[1];
                }
                else if (pair[0] == 'date') {
                    this.curDate = pair[1];
                }
                else if (pair[0] == 'category_id') {
                    this.curCategory = parseInt(pair[1]);
                }
                else if (pair[0] == 'metro_ids') {
                    this.params.metro.id = decodeURIComponent(pair[1]).split(',').map(Number);
                    this.params.metro.name = [];
                }
                else if (pair[0] == 'district_ids') {
                    this.params.districts.id = decodeURIComponent(pair[1]).split(',').map(Number);
                    this.params.districts.name = [];
                }
            }
        }
        var d = new Date();
        if (this.curDate) {
            if (moment(d).isSameOrAfter(this.curDate, 'day')) {
                if (d.getHours() < 18) {
                    this.selectedDate = d;
                    this.curDate = moment(d).format("YYYYMMDD");
                }
                else {
                    this.selectedDate = moment(d).add(1, 'd');
                    this.curDate = this.selectedDate.format("YYYYMMDD");
                }
            }
            else {
                if (moment(this.curDate).isAfter(this.nextMonth, 'day'))
                    if (d.getHours() < 18)
                        this.curDate = moment(d).format("YYYYMMDD");
                    else
                        this.curDate = moment(d).add(1, 'd').format("YYYYMMDD");
                this.selectedDate = moment(this.curDate);
            }
        }
        else {
            if (this.monday.getHours() < 18)
                this.curDate = moment(d).format("YYYYMMDD");
            else
                this.curDate = moment(d).add(1, 'days').format("YYYYMMDD");
            this.selectedDate = moment(this.curDate);
        }
        this.httpService.getCategories().subscribe(function (data) {
            _this.categories = _this.categories.concat(data.categories);
            if (!_this.curCategory)
                _this.curCategory = 0;
            _this.eventsFilter();
        });
        this.monday = moment(this.curDate).startOf('week');
        var s = moment(this.today).startOf('week');
        var e = moment(this.curDate).startOf('week');
        this.week = moment(e).diff(s, 'days');
        this.initDates();
    };
    MainComponent.prototype.initDates = function () {
        this.dates[0] = new Date(this.monday);
        for (var i = 1; i < 7; i++) {
            var d = new Date(this.monday);
            d.setDate(d.getDate() + i);
            this.dates[i] = d;
        }
    };
    MainComponent.prototype.filterByCategory = function (event, category) {
        this.curCategory = this.curCategory == category ? 0 : category;
        this.eventsFilter();
    };
    MainComponent.prototype.filterByDate = function (event, d) {
        if (moment(d).isSameOrAfter(this.today, 'day') && moment(d).isSameOrBefore(this.nextMonth, 'day')) {
            this.curDate = moment(d).format("YYYYMMDD");
            this.selectedDate = d;
            if ($(event.target).hasClass('week-day')) {
                $(event.target).siblings().removeClass('filters-option-active');
                $(event.target).addClass('filters-option-active');
            }
            else {
                $(event.target).parents('.week-day').siblings().removeClass('filters-option-active');
                $(event.target).parents('.week-day').addClass('filters-option-active');
            }
            this.eventsFilter();
        }
    };
    MainComponent.prototype.filterByOption = function (event) {
        $(event.target).siblings().removeClass('filters-option-active');
        $(event.target).toggleClass('filters-option-active');
        this.eventsFilter();
    };
    MainComponent.prototype.filterByTime = function (event, time) {
        if (this.params.time_from == time.time_from && this.params.time_to == time.time_to) {
            this.params.time_from = 8;
            this.params.time_to = 23;
        }
        else {
            this.params.time_from = time.time_from;
            this.params.time_to = time.time_to;
        }
        this.eventsFilter();
    };
    MainComponent.prototype.filterByAge = function (event, age) {
        if (this.params.age_from == age[0]) {
            this.params.age_from = null;
            this.params.age_to = null;
        }
        else {
            this.params.age_from = age[0];
            this.params.age_to = age[1];
        }
        this.eventsFilter();
    };
    MainComponent.prototype.eventsFilter = function () {
        var _this = this;
        var getParams = {};
        if (this.params.age_from != null)
            getParams.age_from = this.params.age_from;
        if (this.params.age_to != null)
            getParams.age_to = this.params.age_to;
        if (this.params.time_from != null)
            getParams.time_from = this.params.time_from;
        if (this.params.time_to != null)
            getParams.time_to = this.params.time_to;
        if (this.params.districts.id && this.params.districts.id.length) {
            getParams.district_ids = this.params.districts.id;
        }
        if (this.params.metro.id && this.params.metro.id.length) {
            getParams.metro_ids = this.params.metro.id;
        }
        if (window.location.hash)
            this.hash = window.location.hash;
        this.gs.url = {};
        for (var key in getParams) {
            this.gs.url[key] = getParams[key];
        }
        this.gs.url['category_id'] = this.curCategory;
        this.gs.url['date'] = this.curDate;
        this.router.navigate(['/'], { queryParams: this.gs.url });
        this.httpService.getSchedule(this.curCategory, this.curDate, getParams).subscribe(function (data) {
            _this.events = [];
            if (data.results > 0) {
                _this.parseActivities(data);
            }
            if (_this.hash) {
                var pageScrollInstance_1 = ng2_page_scroll_1.PageScrollInstance.newInstance({ document: _this.document, scrollTarget: _this.hash, pageScrollDuration: 0 });
                var th_1 = _this;
                th_1.pageScrollService.start(pageScrollInstance_1);
                setTimeout(function () {
                    th_1.pageScrollService.start(pageScrollInstance_1);
                }, 0);
                _this.hash = '';
            }
        });
    };
    MainComponent.prototype.nextWeek = function (event) {
        if (this.week < 28) {
            this.monday.add(7, 'd');
            this.initDates();
            this.week += 7;
        }
    };
    MainComponent.prototype.lastWeek = function (event) {
        if (this.week > 0) {
            this.monday.subtract(7, 'd');
            this.initDates();
            this.week -= 7;
        }
    };
    MainComponent.prototype.parseActivities = function (data) {
        for (var item in data.activities) {
            var timeslotMin = void 0;
            var timeslotMax = void 0;
            var priceMax = void 0;
            var priceMin = void 0;
            var priceOld = void 0;
            var discount = 0;
            for (var location_1 in data.activities[item].locations) {
                for (var time in data.activities[item].locations[location_1].time_slots) {
                    if (data.activities[item].locations[location_1].time_slots[time].price_without_discount > 0) {
                        var tmp = (1 - data.activities[item].locations[location_1].time_slots[time].price / data.activities[item].locations[location_1].time_slots[time].price_without_discount) * 100;
                        if (tmp > discount)
                            discount = tmp;
                    }
                    if (!timeslotMin || timeslotMin > data.activities[item].locations[location_1].time_slots[time].start_time)
                        timeslotMin = data.activities[item].locations[location_1].time_slots[time].start_time;
                    if (!timeslotMax || timeslotMax < data.activities[item].locations[location_1].time_slots[time].end_time)
                        timeslotMax = data.activities[item].locations[location_1].time_slots[time].end_time;
                    if (!priceMin || priceMin > data.activities[item].locations[location_1].time_slots[time].price)
                        priceMin = data.activities[item].locations[location_1].time_slots[time].price;
                    if (!priceMax || priceMax < data.activities[item].locations[location_1].time_slots[time].price)
                        priceMax = data.activities[item].locations[location_1].time_slots[time].price;
                    if (!priceOld || priceOld > data.activities[item].locations[location_1].time_slots[time].price_without_discount)
                        priceOld = data.activities[item].locations[location_1].time_slots[time].price_without_discount;
                    // this.events.push({
                    // 	'id': data.activities[item].id,
                    // 	'name': data.activities[item].name,
                    // 	'description': data.activities[item].description,
                    // 	'photo': data.activities[item].photo,
                    // 	'duration': data.activities[item].duration,
                    // 	'age_from': data.activities[item].age_from,
                    // 	'age_to': data.activities[item].age_to,
                    // 	'extra': data.activities[item].extra,
                    // 	'locations': {
                    // 		'id': data.activities[item].locations[location].id,
                    // 		'address': data.activities[item].locations[location].address,
                    // 		'latitude': data.activities[item].locations[location].latitude,
                    // 		'longitude': data.activities[item].locations[location].longitude,
                    // 		'time_slots':{
                    // 			'id': data.activities[item].locations[location].time_slots[time].id,
                    // 			'date': data.activities[item].locations[location].time_slots[time].date,
                    // 			'start_time': data.activities[item].locations[location].time_slots[time].start_time,
                    // 			'end_time': data.activities[item].locations[location].time_slots[time].end_time,
                    // 			'free_seats': data.activities[item].locations[location].time_slots[time].free_seats,
                    // 			'allocated_seats': data.activities[item].locations[location].time_slots[time].allocated_seats,
                    // 			'price': data.activities[item].locations[location].time_slots[time].price,
                    // 			'discount': discount
                    // 		}
                    // 	},
                    // 	'provider': {
                    // 		'id': data.activities[item].provider.id,
                    // 		'name': data.activities[item].provider.name,
                    // 		'legal': {
                    // 			'contract_date': data.activities[item].provider.legal.contract_date,
                    // 			'legal_name': data.activities[item].provider.legal.legal_name,
                    // 			'contact_phone': data.activities[item].provider.legal.contact_phone,
                    // 			'contact_email': data.activities[item].provider.legal.contact_email,
                    // 			'tax_num': data.activities[item].provider.legal.tax_num,
                    // 		}
                    // 	},
                    // 	'time_min': timeslotMin,
                    // 	'time_max': timeslotMax
                    // });
                }
            }
            data.activities[item]['time_min'] = timeslotMin;
            data.activities[item]['time_max'] = timeslotMax;
            data.activities[item]['price_min'] = priceMin;
            data.activities[item]['price_old'] = priceOld;
            if (priceMin != priceMax) {
                data.activities[item]['price_max'] = priceMax;
            }
            if (discount > 0) {
                data.activities[item]['discount'] = discount;
            }
        }
        this.events = data.activities;
    };
    MainComponent.prototype.districtsFilter = function (districts) {
        this.params.districts = districts;
        this.params.metro = {};
        this.eventsFilter();
    };
    MainComponent.prototype.metroFilter = function (metro) {
        this.params.districts = {};
        this.params.metro = metro;
        this.eventsFilter();
    };
    MainComponent.prototype.declOfNum = function (number, titles) {
        var cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    };
    MainComponent.prototype.openCourse = function (course) {
        this.router.navigateByUrl("/event/" + this.curDate + "/" + course.id);
    };
    return MainComponent;
}());
MainComponent = __decorate([
    core_1.Component({
        selector: 'main-app',
        templateUrl: "../static/main.html?v=" + new Date().getTime(),
        providers: [api_service_1.Api]
    }),
    __param(4, core_1.Inject(platform_browser_1.DOCUMENT)),
    __metadata("design:paramtypes", [api_service_1.Api, router_1.Router, app_global_service_1.GlobalService, ng2_page_scroll_1.PageScrollService, Object])
], MainComponent);
exports.MainComponent = MainComponent;
//# sourceMappingURL=main.component.js.map