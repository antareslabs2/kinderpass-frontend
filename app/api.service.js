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
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
require("rxjs/add/observable/throw");
var Api = (function () {
    function Api(http, _window) {
        this.http = http;
        this._window = _window;
        var headers = new http_1.Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        this.options = new http_1.RequestOptions({ headers: headers, withCredentials: true });
        if (this._window.location.hostname == 'kinderpass.ru')
            this.url = 'https://api.kinderpass.ru/';
        else if (this._window.location.hostname == 'dev.kinderpass.ru')
            this.url = 'http://dev.kinderpass.ru:8000/';
        else
            this.url = 'http://test.kinderpass.ru/';
    }
    Api.prototype.getInfo = function () {
        return this.http.get(this.url + 'api/accounts/get_info', this.options)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    Api.prototype.updateInfo = function (data) {
        return this.http.post(this.url + 'api/accounts/update_contacts', data, this.options)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    Api.prototype.logout = function () {
        return this.http.get(this.url + 'api/accounts/logout', this.options)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    Api.prototype.getDistricts = function () {
        return this.http.get(this.url + 'api/geo/districts')
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    Api.prototype.getMetro = function () {
        return this.http.get(this.url + 'api/geo/metro')
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    Api.prototype.getCategories = function () {
        return this.http.get(this.url + 'api/activities/categories')
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    Api.prototype.getSchedule = function (category_id, date, getParams) {
        var url = this.url + 'api/activities/list/' + category_id + '/' + date + '?';
        for (var key in getParams) {
            url += key + '=' + getParams[key] + '&';
        }
        return this.http.get(url)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    Api.prototype.initTransaction = function (type, amount) {
        var url = this.url + 'api/accounts/initiate_transaction';
        if (!device.desktop()) {
            url += "?pageView=MOBILE";
        }
        var data = {
            'amount': amount,
            'transaction_type': type
        };
        return this.http.post(url, data, this.options)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) {
            console.log(error);
            return Observable_1.Observable.throw(error);
        });
    };
    Api.prototype.checkTransaction = function (transactionID) {
        var url = this.url + 'api/accounts/check_transaction/' + transactionID;
        return this.http.post(url, '', this.options)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return Observable_1.Observable.throw(error); });
    };
    Api.prototype.makingBooking = function (timeSlotID, seats) {
        var url = this.url + 'api/activities/book/' + timeSlotID + '/' + seats;
        return this.http.get(url, this.options)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return error; });
    };
    Api.prototype.cancelBooking = function (bookingID) {
        var url = this.url + 'api/activities/cancel_booking/' + bookingID;
        return this.http.get(url, this.options)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return error; });
    };
    Api.prototype.getEventById = function (timeslot_id) {
        var url = this.url + 'api/activities/timeslot/' + timeslot_id;
        return this.http.get(url, this.options)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) { return error; });
    };
    return Api;
}());
Api = __decorate([
    core_1.Injectable(),
    __param(1, core_1.Inject(Window)),
    __metadata("design:paramtypes", [http_1.Http, Window])
], Api);
exports.Api = Api;
//# sourceMappingURL=api.service.js.map