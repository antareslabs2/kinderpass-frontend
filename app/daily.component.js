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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var api_service_1 = require("./api.service");
var app_global_service_1 = require("./app.global.service");
var moment = require("moment");
var DailyComponent = (function () {
    function DailyComponent(httpService, gs) {
        this.httpService = httpService;
        this.gs = gs;
        this.gs.innerpage = true;
        this.innerpage = true;
        this.events = [];
    }
    DailyComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.httpService.getDailyPicks().subscribe(function (data) {
            if (data.activities) {
                for (var i in data.activities) {
                    for (var j in data.activities[i].locations) {
                        for (var z in data.activities[i].locations[j].time_slots) {
                            var date = data.activities[i].locations[j].time_slots[z].date;
                            data.activities[i].locations[j].time_slots[z].date = moment(date.replace(/(\d+).(\d+).(\d+)/, '$3-$2-$1')).format();
                        }
                    }
                }
            }
            _this.events = data.activities;
        });
    };
    return DailyComponent;
}());
DailyComponent = __decorate([
    core_1.Component({
        selector: 'daily',
        templateUrl: "../static/daily.html?v=" + new Date().getTime(),
        providers: [api_service_1.Api]
    }),
    __metadata("design:paramtypes", [api_service_1.Api, app_global_service_1.GlobalService])
], DailyComponent);
exports.DailyComponent = DailyComponent;
//# sourceMappingURL=daily.component.js.map