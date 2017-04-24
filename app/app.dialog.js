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
var http_service_1 = require("./http.service");
var DialogComponent = (function () {
    function DialogComponent(httpService) {
        this.httpService = httpService;
        this.visibleChange = new core_1.EventEmitter();
        this.districtsFilter = new core_1.EventEmitter();
        this.metroFilter = new core_1.EventEmitter();
        this.count = { 'districts': 0, 'metro': 0 };
        this.districts = {};
        this.metro = {};
        this.districtsNames = ["Адмиралтейский", "Василеостровский", "Выборгский", "Калининский", "Кировский", "Колпинский", "Красногвардейский", "Красносельский", "Кронштадтский", "Курортный", "Московский", "Невский", "Петроградский", "Петродворцовый", "Приморский", "Пушкинский", "Фрунзенский", "Центральный", "Павловский", "Ломоносовский"];
        this.metroStations = ["Ладожская", "Проспект Большевиков", "Улица Дыбенко", "Елизаровская", "Ломоносовская", "Пролетарская", "Обухово", "Рыбацкое", "Новочеркасская", "Лиговский проспект", "Площадь Александра Невского 2", "Площадь Александра Невского 1", "Бухарестская", "Международная", "Волковская", "Обводный канал 1", "Фрунзенская", "Московские ворота", "Электросила", "Парк Победы", "Московская", "Звездная", "Купчино", "Звенигородская", "Пушкинская", "Владимировская", "Достоевская", "Спасская", "Маяковская", "Гостиный двор", "Площадь Восстания", "Садовая", "Сенная площадь", "Технологический институт 1", "Технологический институт 2", "Невский проспект", "Балтийская", "Кировский завод", "Нарвская", "Автово", "Ленинский проспект", "Проспект Ветеранов", "Адмиралтейская", "Василеостровская", "Приморская", "Спортивная", "Чкаловская", "Горьковская", "Петроградская", "Черная речка", "Пионерская", "Удельная", "Крестовский остров", "Комендантский проспект", "Старая деревня", "Озерки", "Парнас", "Проспект просвещения", "Площадь Мужества", "Политехническая", "Академическая", "Гражданский проспект", "Девяткино", "Чернышевская", "Площадь Ленина", "Выборгская", "Лесная"];
    }
    DialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        for (var i in this.districtsNames) {
            var tmp = {};
            this.districts[this.districtsNames[i]] = {
                'selected': false,
                'active': false
            };
        }
        this.httpService.getDistricts().subscribe(function (data) {
            if (data.status = "OK") {
                for (var i in data.districts) {
                    if (_this.districts.hasOwnProperty(data.districts[i].name)) {
                        _this.districts[data.districts[i].name].active = true;
                        _this.districts[data.districts[i].name].id = data.districts[i].id;
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
            if (data.status = "OK") {
                for (var i in data.metro) {
                    if (_this.metro.hasOwnProperty(data.metro[i].name)) {
                        _this.metro[data.metro[i].name].active = true;
                        _this.metro[data.metro[i].name].id = data.metro[i].id;
                    }
                }
            }
        });
    };
    DialogComponent.prototype.close = function () {
        this.visible = '';
        this.visibleChange.emit(false);
    };
    DialogComponent.prototype.applyDistricts = function () {
        var selected = [];
        for (var district in this.districts) {
            if (this.districts[district].selected)
                selected.push(this.districts[district].id);
        }
        this.districtsFilter.emit(selected);
        this.close();
    };
    DialogComponent.prototype.applyMetro = function () {
        var selected = [];
        for (var metro in this.metro) {
            if (this.metro[metro].selected)
                selected.push(this.metro[metro].id);
        }
        this.metroFilter.emit(selected);
        this.close();
    };
    DialogComponent.prototype.makingBooking = function (timeSlotID, seats) {
        this.httpService.makingBooking(timeSlotID, seats).subscribe(function (data) {
            console.log(data);
        });
        ;
    };
    DialogComponent.prototype.declOfNum = function (number, titles) {
        var cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    };
    DialogComponent.prototype.toggleDistrict = function (name) {
        if (this.districts[name].active) {
            this.count.districts -= this.districts[name].selected;
            this.districts[name].selected = !this.districts[name].selected;
            this.count.districts += this.districts[name].selected;
        }
    };
    DialogComponent.prototype.toggleMetro = function (name) {
        if (this.metro[name].active) {
            this.count.metro -= this.metro[name].selected;
            this.metro[name].selected = !this.metro[name].selected;
            this.count.metro += this.metro[name].selected;
        }
    };
    DialogComponent.prototype.resetDistricts = function () {
        this.count.districts = 0;
        for (var district in this.districts) {
            this.districts[district].selected = false;
        }
        for (var metro in this.metro) {
            this.metro[metro].selected = false;
        }
    };
    DialogComponent.prototype.resetMetro = function () {
        this.count.metro = 0;
        for (var metro in this.metro) {
            this.metro[metro].selected = false;
        }
    };
    return DialogComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DialogComponent.prototype, "visible", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], DialogComponent.prototype, "event", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DialogComponent.prototype, "visibleChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DialogComponent.prototype, "districtsFilter", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DialogComponent.prototype, "metroFilter", void 0);
DialogComponent = __decorate([
    core_1.Component({
        selector: 'app-dialog',
        templateUrl: 'loginPopup.html',
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
    __metadata("design:paramtypes", [http_service_1.HttpService])
], DialogComponent);
exports.DialogComponent = DialogComponent;
//# sourceMappingURL=app.dialog.js.map