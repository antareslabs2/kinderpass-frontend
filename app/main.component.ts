import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Api } from './api.service';
import { GlobalService } from './app.global.service';
import { Router } from "@angular/router";
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import {DOCUMENT} from '@angular/platform-browser';
import { trigger, state, style, animate, transition } from '@angular/animations';

import * as moment from 'moment';
import * as $ from 'jquery';
declare var device: any;

@Component({
	selector: 'main-app',
	templateUrl: `../static/main.html?v=${new Date().getTime()}`,
	providers: [Api],
	animations: [
		trigger('slideToggleH', [
			state('1' , style({ 
				height: '450px', 
				marginTop: "20px",
				visibility: "visible"
			})),
			state('0', style({ 
				height: 0,
				marginTop: 0,
				visibility: "hidden"
			})),
			transition('1 => 0', animate(250)),
			transition('0 => 1', animate('0.2s 250ms ease-out'))
		]),
		trigger('slideToggleW', [
			state('1' , style({ 
				width: "315px", 
				left: "35px", 
				backgroundColor: "#1cbbb4"
			})),
			state('0', style({ 
				width: "100%", 
				left: "0", 
				backgroundColor: "#9a8ac1"
			})),
			transition('1 => 0', animate('0.2s 250ms ease-out')),
			transition('0 => 1', animate(250))
		])
	]
})

export class MainComponent implements OnInit { 
	@ViewChild('select') myInput: any;
	categories:any;
	events:any;
	dates:any[];
	months:string[];
	ages:any[];

	today:any;
	nextMonth:any;

	week:number;
	monday: any;
	times: any;
	selectedDate:any;
	msg: string;

	metro: any[];
	districts: any[];
	selectedDistricts: string[];
	
	curDate:string;
	curCategory : number;
	params:any;

	hash: string;

	showDistricts : boolean;

	constructor(private httpService: Api, private router:Router, private gs:GlobalService, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any){
		this.hash = '';
		this.gs.innerpage = false;
		this.monday = new Date();
		this.today = new Date();
		this.nextMonth = moment(this.today).add(1, 'month').format();

		this.selectedDate = new Date();
		this.events = [];
		this.dates = [];
		this.months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
		this.ages = [[0,2],[3,5],[6,9],[10,14]];
		this.times = [
			{
				"key":"День",
				"time_from":8,
				"time_to": 16
			},
			{
				"key":"Вечер",
				"time_from":17,
				"time_to": 23
			},
			{
				"key":"Весь день",
				"time_from":8,
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
		this.categories = [{id:0,name:"Все"}];
		this.showDistricts = false;
		this.selectedDistricts = [];
	}

	ngOnInit(){
		this.gs.innerpage = false;

		this.httpService.getDistricts().subscribe((data:any) => {
			for(let i in data.districts) {
				if (this.params.districts.indexOf(data.districts[i].id) != -1){
					data.districts[i].selected = true;
					this.selectedDistricts.push(data.districts[i].name);
				}
			}
			this.districts = data.districts;
		});

		// this.httpService.getMetro().subscribe((data:any) => {
		// 	for(let i in data.metro) {
		// 		if (this.params.metro.indexOf(data.metro[i].id) != -1)
		// 			data.metro[i].selected = true;
		// 	}
		// 	this.metro = data.metro;
		// });

		if(location.search){
			let search = location.search.substring(1);
			let vars = search.split('&');
			for (let i = 0; i < vars.length; i++) {
				let pair = vars[i].split('=');
				if (pair[0] in this.params) {
					this.params[pair[0]] = pair[1];
				} else if(pair[0] == 'date') {
					this.curDate = pair[1];
				} else if (pair[0] == 'category_id') {
					this.curCategory = parseInt(pair[1]);
				} else if (pair[0] == 'metro_ids') {
					this.params.metro = decodeURIComponent(pair[1]).split(',').map(Number);
				} else if (pair[0] == 'district_ids') {
					this.params.districts = decodeURIComponent(pair[1]).split(',').map(Number);
				}
			}
		}

		let d = new Date();
		
		if (this.curDate) {
			if(moment(d).isSameOrAfter(this.curDate, 'day')) {
				if (d.getHours() < 18){
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
		} else {
			if (this.monday.getHours() < 18)
				this.curDate = moment(d).format("YYYYMMDD");
			else
				this.curDate = moment(d).add(1,'days').format("YYYYMMDD");
			this.selectedDate = moment(this.curDate);
		}


		this.httpService.getCategories().subscribe((data:any) => {
			this.categories = this.categories.concat(data.categories);
			if(!this.curCategory)
				this.curCategory = 0;
			this.eventsFilter();
		});
		this.monday= moment(this.curDate).startOf('week');
		let s = moment(this.today).startOf('week');
		let e = moment(this.curDate).startOf('week');
		this.week = moment(e).diff(s, 'days');
		this.initDates();

	}

	initDates() : void {
		this.dates[0] = new Date(this.monday);
		for(let i=1; i<7; i++) {
			let d = new Date(this.monday);
			d.setDate(d.getDate() + i);
			this.dates[i] = d;
		}
	}

	filterByCategory(event:any, category: number):void {
		this.curCategory = this.curCategory == category ? 0 : category;

		this.eventsFilter();
	}

	filterByDate(event:any, d: any) : void {
		if(moment(d).isSameOrAfter(this.today, 'day') && moment(d).isSameOrBefore(this.nextMonth, 'day')) {
			this.curDate = moment(d).format("YYYYMMDD");
			this.selectedDate = d;
			if ($(event.target).hasClass('week-day')) {
				$(event.target).siblings().removeClass('filters-option-active');
				$(event.target).addClass('filters-option-active');
			} else {
				$(event.target).parents('.week-day').siblings().removeClass('filters-option-active');
				$(event.target).parents('.week-day').addClass('filters-option-active');
			}
			this.eventsFilter();
		}
	}

	filterByOption(event:any) : void {
		$(event.target).siblings().removeClass('filters-option-active');
		$(event.target).toggleClass('filters-option-active');
		this.eventsFilter();
	}

	filterByTime(event:any, time:any) {
		if (this.params.time_from == time.time_from && this.params.time_to == time.time_to) {
			this.params.time_from = 8;
			this.params.time_to = 23;
		} else {
			this.params.time_from = time.time_from;
			this.params.time_to = time.time_to;
		}
		this.eventsFilter();
	}

	filterByAge(event:any, age:number[]) {
		if (this.params.age_from == age[0]) {
			this.params.age_from = null;
			this.params.age_to = null;
		} else {
			this.params.age_from = age[0];
			this.params.age_to = age[1];
		}
		this.eventsFilter();
	}

	eventsFilter() : void {
		let getParams:any = {};
		if (this.params.age_from != null)
			getParams.age_from = this.params.age_from;
		if (this.params.age_to != null)
			getParams.age_to = this.params.age_to;
		if (this.params.time_from != null)
			getParams.time_from = this.params.time_from;
		if (this.params.time_to != null)
			getParams.time_to = this.params.time_to;
		if (this.params.districts.length) {
			for (let key in this.params.districts) {
				if (getParams.district_ids)
					getParams.district_ids += ',' + this.params.districts[key] ;
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
		for (let key in getParams) {
			this.gs.url[key]  = getParams[key];
		}
		this.gs.url['category_id']= this.curCategory;
		this.gs.url['date'] = this.curDate;

		this.router.navigate(['/'], { queryParams: this.gs.url });

		this.httpService.getSchedule(this.curCategory, this.curDate, getParams).subscribe((data:any) => {
			this.events = [];
			if(data.results > 0) {
				this.parseActivities(data);
			}
			if (this.hash) {
				let pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({document: this.document, scrollTarget: this.hash, pageScrollDuration: 0});
				let th = this;
				th.pageScrollService.start(pageScrollInstance);
				setTimeout(() => {
				  th.pageScrollService.start(pageScrollInstance);
				  }, 0);
				this.hash = '';
			}
		});
	}

	nextWeek(event:any) : void {
		if (this.week < 28) {
			this.monday.add(7,'d');
			this.initDates();
			this.week += 7;
		}
	}

	lastWeek(event:any) : void {
		if (this.week > 0) {
			this.monday.subtract(7,'d')
			this.initDates();
			this.week -= 7;
		}
	}

	parseActivities(data: any) : void {
		for( let item in data.activities) {
			let timeslotMin: string;
			let timeslotMax: string;
			let priceMax: number;
			let priceMin: number;
			let priceOld: number;
			let discount = 0;
			for( let location in data.activities[item].locations) {
				for (let time in data.activities[item].locations[location].time_slots) {
					if (data.activities[item].locations[location].time_slots[time].price_without_discount > 0) {
						let tmp = (1-data.activities[item].locations[location].time_slots[time].price/data.activities[item].locations[location].time_slots[time].price_without_discount)*100;
						if (tmp > discount)
							discount = tmp;
					}
					if (!timeslotMin || timeslotMin > data.activities[item].locations[location].time_slots[time].start_time)
						timeslotMin = data.activities[item].locations[location].time_slots[time].start_time;
					if (!timeslotMax || timeslotMax < data.activities[item].locations[location].time_slots[time].end_time)
						timeslotMax = data.activities[item].locations[location].time_slots[time].end_time;
					if (!priceMin || priceMin > data.activities[item].locations[location].time_slots[time].price)
						priceMin = data.activities[item].locations[location].time_slots[time].price;
					if (!priceMax || priceMax < data.activities[item].locations[location].time_slots[time].price)
						priceMax = data.activities[item].locations[location].time_slots[time].price;
					if (!priceOld || priceOld > data.activities[item].locations[location].time_slots[time].price_without_discount)
						priceOld = data.activities[item].locations[location].time_slots[time].price_without_discount;
					// this.events.push({
					// 	'id': data.activities[item].id,
					// 	'name': data.activities[item].name,
					// 	'description': data.activities[item].description,
					// 	'photo': data.activities[item].photo,
					// 	'duration': data.activities[item].duration,
					// 	'age_from': data.activities[item].age_from,
					// 	'age_to': data.activities[item].age_to,
					// 	'extra': data.activities[item].extra,
					// 	'locations': {
					// 		'id': data.activities[item].locations[location].id,
					// 		'address': data.activities[item].locations[location].address,
					// 		'latitude': data.activities[item].locations[location].latitude,
					// 		'longitude': data.activities[item].locations[location].longitude,
					// 		'time_slots':{
					// 			'id': data.activities[item].locations[location].time_slots[time].id,
					// 			'date': data.activities[item].locations[location].time_slots[time].date,
					// 			'start_time': data.activities[item].locations[location].time_slots[time].start_time,
					// 			'end_time': data.activities[item].locations[location].time_slots[time].end_time,
					// 			'free_seats': data.activities[item].locations[location].time_slots[time].free_seats,
					// 			'allocated_seats': data.activities[item].locations[location].time_slots[time].allocated_seats,
					// 			'price': data.activities[item].locations[location].time_slots[time].price,
					// 			'discount': discount
					// 		}
					// 	},
					// 	'provider': {
					// 		'id': data.activities[item].provider.id,
					// 		'name': data.activities[item].provider.name,
					// 		'legal': {
					// 			'contract_date': data.activities[item].provider.legal.contract_date,
					// 			'legal_name': data.activities[item].provider.legal.legal_name,
					// 			'contact_phone': data.activities[item].provider.legal.contact_phone,
					// 			'contact_email': data.activities[item].provider.legal.contact_email,
					// 			'tax_num': data.activities[item].provider.legal.tax_num,
					// 		}
					// 	},
					// 	'time_min': timeslotMin,
					// 	'time_max': timeslotMax
					// });
				}
			}
			data.activities[item]['time_min'] = timeslotMin;
			data.activities[item]['time_max'] = timeslotMax;
			data.activities[item]['price_min'] = priceMin;
			data.activities[item]['price_old'] = priceOld;
			if (priceMin != priceMax) {
				data.activities[item]['price_max'] = priceMax;
			}
			if (discount > 0) {
				data.activities[item]['discount'] = discount;
			}
		}
		this.events = data.activities;
	}
	
	districtsFilter(ind:number) : void {
		if (this.params.districts.length) {
			let index = this.params.districts.indexOf(this.districts[ind].id);
			if (index == -1) {
				this.params.districts.push(this.districts[ind].id);
				this.selectedDistricts.push(this.districts[ind].name);
			} else {
				this.params.districts.splice(index, 1);
				index = this.selectedDistricts.indexOf(this.districts[ind].name);
				this.selectedDistricts.splice(index, 1);
			}
		} else {
			this.params.districts.push(this.districts[ind].id);
			this.selectedDistricts.push(this.districts[ind].name);
		}
		this.districts[ind].selected = !this.districts[ind].selected;
		// this.params.metro = {};
		this.eventsFilter();
	}

	resetDistrictFilter() {
		this.params.districts = [];
		for( let ind in this.districts) {
			this.districts[ind].selected = false;
		}
		this.selectedDistricts = [];
		this.eventsFilter();
	}
	
	metroFilter(metro:any) : void {
		this.params.districts = [];
		this.params.metro = metro;
		this.eventsFilter();
	}	

	toggleLocations() {
		if (!device.desktop()) {
			$('select[name="districts"]').addClass('vis');

			setTimeout(() => {
				$('#districts').focus();
			}, 1000);
		} else
			this.showDistricts = !this.showDistricts;
	}

	change(options: any) {
		let selectedValues = Array.apply(null,options)
		      .filter((option : any) => option.selected)
		      .map((option : any) => +option.value.split(': ')[1])
		this.params.districts = selectedValues;
		this.eventsFilter();
	}
}