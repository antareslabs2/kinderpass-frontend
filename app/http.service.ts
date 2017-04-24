import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
 
@Injectable()
export class HttpService{

    private url = 'https://test.kinderpass.ru/';
    constructor(private http: Http){ }
     
    getInfo(){
        return this.http.get(this.url + 'api/accounts/get_info')
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    getDistricts(){
        return this.http.get(this.url + 'api/geo/districts')
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    getMetro(){
        return this.http.get(this.url + '/api/geo/metro')
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

    initTransaction(category_id: number, date : string, getParams: any){
        let url = this.url + 'api/activities/list/' + category_id + '/' + date + '?';
        for(let key in getParams) {
            url += key + '=' + getParams[key] + '&';
        }
        return this.http.get(url)
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    testing(data:string){
         
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });

        this.http.post('http://demo.paykeeper.ru/create/', data, {headers:headers})
                    .map((resp:Response)=>resp.json())
                    .catch((error:any) =>{return Observable.throw(error);}); 
        return this.http.post('http://demo.paykeeper.ru/create/', data, {headers:headers})
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return Observable.throw(error);}); 
    }

    makingBooking(timeSlotID:number, seats:number){
        // In docs method = POST
        const body = '';
                 
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
         
        let url = this.url + 'api/activities/book/' + timeSlotID + '/' + seats;

        return this.http.get(url)
                        .map((resp:Response)=>resp.json())
                        .catch((error:any) =>{return error;});
    }
}