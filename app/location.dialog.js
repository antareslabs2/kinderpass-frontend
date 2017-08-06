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
var LocationComponent = (function () {
    function LocationComponent(gs) {
        this.gs = gs;
        this.districtsFilter = new core_1.EventEmitter();
        this.metroFilter = new core_1.EventEmitter();
    }
    LocationComponent.prototype.close = function () {
        this.gs.popupName = '';
        $("html").removeClass('locked');
    };
    LocationComponent.prototype.applyDistricts = function () {
        var selected = { 'id': [], 'name': [] };
        for (var district in this.districts) {
            if (this.districts[district].selected) {
                selected.id.push(this.districts[district].id);
                selected.name.push(district);
            }
        }
        this.districtsFilter.emit(selected);
        // this.close();
    };
    LocationComponent.prototype.applyMetro = function () {
        var selected = { 'id': [], 'name': [] };
        for (var metro in this.metro) {
            if (this.metro[metro].selected) {
                selected.id.push(this.metro[metro].id);
                selected.name.push(metro);
            }
        }
        this.metroFilter.emit(selected);
    };
    LocationComponent.prototype.toggleDistrict = function (name) {
        console.log(name);
        if (this.districts[name].active) {
            this.districts[name].selected = !this.districts[name].selected;
        }
        this.applyDistricts();
    };
    LocationComponent.prototype.toggleMetro = function (name) {
        if (this.metro[name].active) {
            this.metro[name].selected = !this.metro[name].selected;
        }
        this.applyMetro();
    };
    LocationComponent.prototype.resetDistricts = function () {
        for (var district in this.districts) {
            this.districts[district].selected = false;
        }
        this.applyDistricts();
    };
    LocationComponent.prototype.resetMetro = function () {
        for (var metro in this.metro) {
            this.metro[metro].selected = false;
        }
        this.applyMetro();
    };
    LocationComponent.prototype.toggleLocation = function (event) {
        this.toggleDistrict(event[0].name);
    };
    return LocationComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], LocationComponent.prototype, "districts", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], LocationComponent.prototype, "metro", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], LocationComponent.prototype, "districtsFilter", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], LocationComponent.prototype, "metroFilter", void 0);
LocationComponent = __decorate([
    core_1.Component({
        selector: 'location-dialog',
        templateUrl: "static/location.html?v=" + new Date().getTime(),
        animations: [
            animations_1.trigger('location-dialog', [
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
], LocationComponent);
exports.LocationComponent = LocationComponent;
//# sourceMappingURL=location.dialog.js.map