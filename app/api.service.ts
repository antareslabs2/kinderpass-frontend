import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import {HttpService} from './http.service';
import {Observable} from 'rxjs/Observable';

declare var device: any;

@Injectable()
export class Api{

    private url:string;
    options:any;
    constructor(private http: Http, @Inject(Window) private _window: Window){ 
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        this.options = new RequestOptions({ headers: headers, withCredentials: true });
        if(this._window.location.hostname == 'kinderpass.ru')
              this.url = 'https://api.kinderpass.ru/';
        else if (this._window.location.hostname == 'dev.kinderpass.ru')
              this.url = 'http://dev.kinderpass.ru:8000/';
        else
              this.url = 'https://test.kinderpass.ru/';
    }
     
    getInfo(){
        return this.http.get(this.url + 'api/accounts/get_info', this.options)
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    updateInfo(data:string){
        return this.http.post(this.url + 'api/accounts/update_contacts', data,  this.options)
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    logout(){
        return this.http.get(this.url + 'api/accounts/logout', this.options)
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    getDistricts(){
        return this.http.get(this.url + 'api/geo/districts')
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    getMetro(){
        return this.http.get(this.url + 'api/geo/metro')
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    getCategories(){
        return this.http.get(this.url + 'api/activities/categories')
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    getSchedule(category_id: number, date : string, getParams: any){
        let url = this.url + 'api/activities/list/' + category_id + '/' + date + '?';
        for(let key in getParams) {
            url += key + '=' + getParams[key] + '&';
        }
        return this.http.get(url)
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    initTransaction(type:string){
        let tmp = '';
        if (!device.desktop()) {
            tmp = "?pageView=MOBILE"
        }
        let url = this.url + 'api/accounts/initiate_transaction/' + type + tmp;
        return this.http.post(url, '',  this.options)
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    checkTransaction(transactionID:string) {
        let url = this.url + 'api/accounts/check_transaction/' + transactionID;
        return this.http.post(url, '',  this.options)
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }
    makingBooking(timeSlotID:number, seats:number){
        // In docs method = POST
         
        let url = this.url + 'api/activities/book/' + timeSlotID + '/' + seats;

        return this.http.get(url, this.options)
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return error;});
    }

    cancelBooking(bookingID:number){
        // In docs method = POST
         
        let url = this.url + 'api/activities/cancel_booking/' + bookingID;

        return this.http.get(url, this.options)
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return error;});
    }

    registration(data:any){
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });

        return this.http.post('https://script.google.com/macros/s/AKfycbzLz5xJS2x726J14D04DOYNyuuhIRrAqXlRlaJTf7sYSgoQcfE/exec', data)
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    getEventById(timeslot_id:number) {
        let url = this.url + 'api/activities/timeslot/' + timeslot_id;

        return this.http.get(url, this.options)
            .map((resp:Response)=>resp.json())
            .catch((error:any) =>{return error;});
    }
}