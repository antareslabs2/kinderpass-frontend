import { Component, OnInit } from '@angular/core';
import { Api } from './api.service';
import { GlobalService } from './app.global.service';
import { Location } from '@angular/common'

import * as moment from 'moment';

@Component({
	selector: 'daily',
	templateUrl: `../static/daily.html?v=${new Date().getTime()}`,
	providers: [Api]
})

export class DailyComponent implements OnInit { 
	
	events: any[];
	innerpage:boolean;
 
	constructor(private httpService: Api, private gs: GlobalService){
		this.gs.innerpage = true;
		this.innerpage = true;
		this.events = [];
	}

	ngOnInit(){
		this.httpService.getDailyPicks().subscribe((data:any) => {
			if(data.activities){
				for (let i in data.activities) {
					for (let j in data.activities[i].locations) {
						for (let z in data.activities[i].locations[j].time_slots) {
							let date = data.activities[i].locations[j].time_slots[z].date;
							data.activities[i].locations[j].time_slots[z].date = moment(date.replace(/(\d+).(\d+).(\d+)/,'$3-$2-$1')).format();
						}
					}
				}
				
			}
			this.events = data.activities;
		});
		
	}

}	