import { Component, OnInit} from '@angular/core';
import { Response} from '@angular/http';
import { HttpService} from './http.service';

@Component({
    selector: 'my-app',
    templateUrl: 'main.html',
    providers: [HttpService]
})

export class AppComponent implements OnInit { 
  
    constructor(private httpService: HttpService){}
    categories = {};
    ngOnInit(){
         
        this.httpService.getCategories().subscribe((data) => {this.categories=JSON.stringify(data);});
    }
                
}