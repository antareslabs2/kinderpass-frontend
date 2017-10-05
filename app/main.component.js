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
var animations_1 = require("@angular/animations");
var forms_1 = require("@angular/forms");
var moment = require("moment");
var $ = require("jquery");
var MainComponent = (function () {
    function MainComponent(httpService, router, route, gs, pageScrollService, document, fb) {
        this.httpService = httpService;
        this.router = router;
        this.route = route;
        this.gs = gs;
        this.pageScrollService = pageScrollService;
        this.document = document;
        this.fb = fb;
        this.hash = '';
        this.gs.innerpage = false;
        this.monday = new Date();
        this.today = new Date();
        this.nextMonth = moment(this.today).add(1, 'month').format('YYYYMMDD');
        this.selectedDate = new Date();
        this.events = [];
        this.dates = [];
        this.months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        this.ages = [[0, 3], [3, 6], [6, 9], [9, 14]];
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
            'districts': [],
            'metro': []
        };
        this.districts = [];
        this.metro = [];
        this.categories = [{ id: 0, name: "Все" }];
        this.showDistricts = false;
        this.selectedDistricts = [];
        this.desktop = device.desktop();
        var th = this;
        $(document).click(function (e) {
            if (th.showDistricts) {
                var list = $(".filters__list");
                var title = $(".filters-location");
                if (list.is(e.target) && list.has(e.target).length || !title.is(e.target) && !title.has(e.target).length) {
                    th.showDistricts = false;
                }
            }
        });
        this.resultsMessage = "Не найдено ни одного мероприятия";
        this.subscribeForm = this.fb.group({
            'contact': ['', []]
        });
    }
    MainComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.gs.innerpage = false;
        this.httpService.getDistricts().subscribe(function (data) {
            for (var i in data.districts) {
                if (_this.params.districts.indexOf(data.districts[i].id) != -1) {
                    data.districts[i].selected = true;
                    _this.selectedDistricts.push(data.districts[i].name);
                }
            }
            _this.districts = data.districts;
        });
        // this.httpService.getMetro().subscribe((data:any) => {
        // 	for(let i in data.metro) {
        // 		if (this.params.metro.indexOf(data.metro[i].id) != -1)
        // 			data.metro[i].selected = true;
        // 	}
        // 	this.metro = data.metro;
        // });
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
                    this.params.metro = decodeURIComponent(pair[1]).split(',').map(Number);
                }
                else if (pair[0] == 'district_ids') {
                    this.params.districts = decodeURIComponent(pair[1]).split(',').map(Number);
                }
                else if (pair[0] == 'cid') {
                    this.gs.traf_cid = pair[1];
                    localStorage.setItem('cid', pair[1]);
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
    MainComponent.prototype.subscribtion = function (form) {
        var _this = this;
        var contact = form.controls.contact.value;
        this.httpService.subscribtion(contact).subscribe(function (data) {
            if (data.status == 'OK') {
                _this.gs.msg = 'Спасибо за подписку. Мы свяжемся с вами в ближайшее время';
                _this.gs.openPopup('msg');
            }
            else {
                _this.gs.msg = 'Что-то пошло не так. Попробуйте обновить страницу';
                _this.gs.openPopup('msgCancel');
            }
        });
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
        ga('send', 'pageview', '/virtual/userfilter/category');
        this.curCategory = this.curCategory == category ? 0 : category;
        this.eventsFilter();
    };
    MainComponent.prototype.filterByDate = function (event, d) {
        ga('send', 'pageview', '/virtual/userfilter/date');
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
        ga('send', 'pageview', '/virtual/userfilter/option');
        $(event.target).siblings().removeClass('filters-option-active');
        $(event.target).toggleClass('filters-option-active');
        this.eventsFilter();
    };
    MainComponent.prototype.filterByTime = function (event, time) {
        ga('send', 'pageview', '/virtual/userfilter/time');
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
        ga('send', 'pageview', '/virtual/userfilter/age');
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
        this.events = [];
        this.resultsMessage = "Загружаю расписание";
        var getParams = {};
        if (this.params.age_from != null)
            getParams.age_from = this.params.age_from;
        if (this.params.age_to != null)
            getParams.age_to = this.params.age_to;
        if (this.params.time_from != null)
            getParams.time_from = this.params.time_from;
        if (this.params.time_to != null)
            getParams.time_to = this.params.time_to;
        if (this.params.districts.length) {
            for (var key in this.params.districts) {
                if (getParams.district_ids)
                    getParams.district_ids += ',' + this.params.districts[key];
                else
                    getParams.district_ids = this.params.districts[key];
            }
        }
        // if (this.params.metro) {
        // 	getParams.metro_ids = this.params.metro;
        // }
        if (window.location.hash)
            this.hash = window.location.hash;
        this.gs.url = {};
        for (var key in getParams) {
            this.gs.url[key] = getParams[key];
        }
        this.gs.url['category_id'] = this.curCategory;
        this.gs.url['date'] = this.curDate;
        if (this.gs.traf_cid) {
            this.gs.url['cid'] = this.gs.traf_cid;
        }
        this.router.navigate(['/'], { replaceUrl: true, relativeTo: this.route, queryParams: this.gs.url });
        this.httpService.getSchedule(this.curCategory, this.curDate, getParams).subscribe(function (data) {
            _this.events = [];
            if (data.results > 0) {
                _this.parseActivities(data);
                _this.resultsMessage = "";
            }
            else {
                _this.resultsMessage = "Не найдено ни одного мероприятия";
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
            var priceWithoutDiscount = 0;
            var priceMin = 0;
            var priceOld = 0;
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
                    if (data.activities[item].locations[location_1].time_slots[time].ticket_types_num > 1) {
                        if (!priceOld || priceOld > data.activities[item].locations[location_1].time_slots[time].price_without_discount)
                            priceOld = data.activities[item].locations[location_1].time_slots[time].price_without_discount;
                    }
                    else {
                        if (!priceWithoutDiscount || priceWithoutDiscount < data.activities[item].locations[location_1].time_slots[time].price_without_discount)
                            priceWithoutDiscount = data.activities[item].locations[location_1].time_slots[time].price_without_discount;
                    }
                    if (!priceMin || priceMin > data.activities[item].locations[location_1].time_slots[time].price)
                        priceMin = data.activities[item].locations[location_1].time_slots[time].price;
                }
            }
            data.activities[item]['time_min'] = timeslotMin;
            data.activities[item]['time_max'] = timeslotMax;
            data.activities[item]['price_min'] = priceMin;
            data.activities[item]['price_old'] = priceOld;
            data.activities[item]['price_without_discount'] = priceWithoutDiscount;
            if (discount > 0) {
                data.activities[item]['discount'] = discount;
            }
        }
        this.events = data.activities;
    };
    MainComponent.prototype.districtsFilter = function (ind) {
        ga('send', 'pageview', '/virtual/userfilter/district');
        if (this.params.districts.length) {
            var index = this.params.districts.indexOf(this.districts[ind].id);
            if (index == -1) {
                this.params.districts.push(this.districts[ind].id);
                this.selectedDistricts.push(this.districts[ind].name);
            }
            else {
                this.params.districts.splice(index, 1);
                index = this.selectedDistricts.indexOf(this.districts[ind].name);
                this.selectedDistricts.splice(index, 1);
            }
        }
        else {
            this.params.districts.push(this.districts[ind].id);
            this.selectedDistricts.push(this.districts[ind].name);
        }
        this.districts[ind].selected = !this.districts[ind].selected;
        // this.params.metro = {};
        this.eventsFilter();
    };
    MainComponent.prototype.resetDistrictFilter = function () {
        this.params.districts = [];
        for (var ind in this.districts) {
            this.districts[ind].selected = false;
        }
        this.selectedDistricts = [];
        this.eventsFilter();
    };
    MainComponent.prototype.metroFilter = function (metro) {
        this.params.districts = [];
        this.params.metro = metro;
        this.eventsFilter();
    };
    MainComponent.prototype.toggleLocations = function () {
        this.showDistricts = !this.showDistricts;
    };
    MainComponent.prototype.change = function (options) {
        var selectedValues = Array.apply(null, options)
            .filter(function (option) { return option.selected; })
            .map(function (option) { return +option.value.split(': ')[1]; });
        this.params.districts = selectedValues;
        this.eventsFilter();
    };
    MainComponent.prototype.showFilters = function (e) {
        var text = e.target.textContent;
        $('.filters-item-desktop').toggleClass('active');
        e.target.textContent = e.target.dataset.text;
        e.target.dataset.text = text;
    };
    MainComponent.prototype.goToEvent = function (id) {
        var _this = this;
        this.router.navigate(['/'], { fragment: 'event_' + id, queryParams: this.gs.url, relativeTo: this.route, });
        setTimeout(function () {
            _this.router.navigate(['/event', _this.curDate, id]);
        });
    };
    return MainComponent;
}());
MainComponent = __decorate([
    core_1.Component({
        selector: 'main-app',
        templateUrl: "../static/main.html?v=" + new Date().getTime(),
        providers: [api_service_1.Api],
        animations: [
            animations_1.trigger('slideToggleH', [
                animations_1.state('1', animations_1.style({
                    height: '410px',
                    marginTop: "20px",
                    visibility: "visible"
                })),
                animations_1.state('0', animations_1.style({
                    height: 0,
                    marginTop: 0,
                    visibility: "hidden"
                })),
                animations_1.transition('1 => 0', animations_1.animate(150)),
                animations_1.transition('0 => 1', animations_1.animate('0.1s 150ms ease-out'))
            ]),
            animations_1.trigger('slideToggleW', [
                animations_1.state('1', animations_1.style({
                    width: "315px",
                    left: "5px",
                    backgroundColor: "#1cbbb4"
                })),
                animations_1.state('0', animations_1.style({
                    width: "100%",
                    left: "0",
                    backgroundColor: "#9a8ac1"
                })),
                animations_1.transition('1 => 0', animations_1.animate('0.1s 150ms ease-out')),
                animations_1.transition('0 => 1', animations_1.animate(150))
            ])
        ]
    }),
    __param(5, core_1.Inject(platform_browser_1.DOCUMENT)),
    __metadata("design:paramtypes", [api_service_1.Api, router_1.Router, router_1.ActivatedRoute, app_global_service_1.GlobalService, ng2_page_scroll_1.PageScrollService, Object, forms_1.FormBuilder])
], MainComponent);
exports.MainComponent = MainComponent;
//# sourceMappingURL=main.component.js.map