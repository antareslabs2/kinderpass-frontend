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
var http_1 = require("@angular/http");
var http_2 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
var HttpService = (function () {
    function HttpService(http) {
        this.http = http;
        this.url = 'https://test.kinderpass.ru/';
    }
    HttpService.prototype.getInfo = function () {
        return this.http.get(this.url + 'api/accounts/get_info')
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    HttpService.prototype.getDistricts = function () {
        return this.http.get(this.url + 'api/geo/districts')
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    HttpService.prototype.getMetro = function () {
        return this.http.get(this.url + '/api/geo/metro')
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    HttpService.prototype.getCategories = function () {
        return this.http.get(this.url + 'api/activities/categories')
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    HttpService.prototype.getSchedule = function (category_id, date, getParams) {
        var url = this.url + 'api/activities/list/' + category_id + '/' + date + '?';
        for (var key in getParams) {
            url += key + '=' + getParams[key] + '&';
        }
        return this.http.get(url)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    HttpService.prototype.initTransaction = function (category_id, date, getParams) {
        var url = this.url + 'api/activities/list/' + category_id + '/' + date + '?';
        for (var key in getParams) {
            url += key + '=' + getParams[key] + '&';
        }
        return this.http.get(url)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    HttpService.prototype.testing = function (data) {
        var headers = new http_2.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        this.http.post('http://demo.paykeeper.ru/create/', data, { headers: headers })
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
        return this.http.post('http://demo.paykeeper.ru/create/', data, { headers: headers })
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    HttpService.prototype.makingBooking = function (timeSlotID, seats) {
        // In docs method = POST
        var body = '';
        var headers = new http_2.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        var url = this.url + 'api/activities/book/' + timeSlotID + '/' + seats;
        return this.http.get(url)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return error; });
    };
    return HttpService;
}());
HttpService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], HttpService);
exports.HttpService = HttpService;
//# sourceMappingURL=http.service.js.map