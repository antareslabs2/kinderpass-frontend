import { Component, OnInit, Inject } from '@angular/core';
import { Api } from './api.service';
import { GlobalService } from './app.global.service';
import { Router } from "@angular/router";
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import {DOCUMENT} from '@angular/platform-browser';

import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
	selector: 'main-app',
	templateUrl: 'static/main.html',
	providers: [Api]
})

export class MainComponent implements OnInit { 
	
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
	resultsToShow:number;
	msg: string;
	openProfile: boolean;

	districtsNames:string[];
	metroStations:string[];

	metro:any;
	districts: any;
	
	curDate:string;
	curCategory : number;
	params:any;

	hash: string;

	constructor(private httpService: Api, private router:Router, private gs:GlobalService, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any){
		this.hash = '';
		this.gs.innerpage = false;
		this.openProfile = false;
		this.resultsToShow = 8;
		this.monday = new Date();
		if (this.monday.getHours() < 23)
			this.today = new Date();
		else
			this.today = moment(new Date()).add(1,'days').format();
		this.nextMonth = moment(this.today).add(1, 'month').format();
		this.week = this.monday.getDay();
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
			'districts': {},
			'metro': {}
		};
		this.districts = {};
		this.metro = {};
		this.districtsNames = [ "Адмиралтейский", "Василеостровский", "Выборгский", "Калининский", "Кировский", "Колпинский", "Красногвардейский", "Красносельский", "Кронштадтский", "Курортный", "Московский", "Невский", "Петроградский", "Петродворцовый", "Приморский", "Пушкинский", "Фрунзенский", "Центральный", "Павловский", "Ломоносовский" ];
		 this.metroStations = [ "Ладожская", "Проспект Большевиков", "Улица Дыбенко", "Елизаровская", "Ломоносовская", "Пролетарская", "Обухово", "Рыбацкое", "Новочеркасская", "Лиговский проспект", "Площадь Александра Невского 2", "Площадь Александра Невского 1", "Бухарестская", "Международная", "Волковская", "Обводный канал 1", "Фрунзенская", "Московские ворота", "Электросила", "Парк Победы", "Московская", "Звездная", "Купчино", "Звенигородская", "Пушкинская", "Владимировская", "Достоевская", "Спасская", "Маяковская", "Гостиный двор", "Площадь Восстания", "Садовая", "Сенная площадь", "Технологический институт 1", "Технологический институт 2", "Невский проспект", "Балтийская", "Кировский завод", "Нарвская", "Автово", "Ленинский проспект", "Проспект Ветеранов", "Адмиралтейская", "Василеостровская", "Приморская", "Спортивная", "Чкаловская", "Горьковская", "Петроградская", "Черная речка", "Пионерская", "Удельная", "Крестовский остров", "Комендантский проспект", "Старая деревня", "Озерки", "Парнас", "Проспект просвещения", "Площадь Мужества", "Политехническая", "Академическая", "Гражданский проспект", "Девяткино", "Чернышевская", "Площадь Ленина", "Выборгская", "Лесная" ];
	}

	ngOnInit(){
		this.gs.innerpage = false;
 
		for (let i in this.districtsNames) {
				let tmp = {};
				this.districts[this.districtsNames[i]] = {
					'selected':false,
					'active': false
				};
		}

		this.httpService.getDistricts().subscribe((data:any) => {
			for(let i in data.districts) {
				if (this.districts.hasOwnProperty(data.districts[i].name)) {
					 this.districts[data.districts[i].name].active = true;
					 this.districts[data.districts[i].name].id = data.districts[i].id;
					 if (this.params.districts.id && this.params.districts.id.indexOf(data.districts[i].id) != -1) {
					 	this.districts[data.districts[i].name].selected = true;
					 	this.params.districts.name.push(data.districts[i].name);
					 }
				}
			}
		});

		for (let i in this.metroStations) {
				let tmp = {};
				this.metro[this.metroStations[i]] = {
					'selected':false,
					'active': false
				};
		}

		this.httpService.getMetro().subscribe((data:any) => {
			for(let i in data.metro) {
				if (this.metro.hasOwnProperty(data.metro[i].name)) {
					 this.metro[data.metro[i].name].active = true;
					 this.metro[data.metro[i].name].id = data.metro[i].id;
					 if (this.params.metro.id && this.params.metro.id.indexOf(data.metro[i].id) != -1) {
					 	this.metro[data.metro[i].name].selected = true;
					 	this.params.metro.name.push(data.metro[i].name);
					 }
				}
			}
		});
		let search = location.search.substring(1);
		if(!location.search){
			if (localStorage.getItem('date'))
				this.curDate = localStorage.getItem('date');
			if (localStorage.getItem('category'))
				this.curCategory = parseInt(localStorage.getItem('category'));
			if (localStorage.getItem('params')) {
				let p = JSON.parse(localStorage.getItem('params'));
				for(let i in p) {
					this.params[i] = p[i];
				}
			}
		} else {
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
					this.params.metro.id = decodeURIComponent(pair[1]).split(',').map(Number);
					this.params.metro.name=[];
				} else if (pair[0] == 'district_ids') {
					this.params.districts.id = decodeURIComponent(pair[1]).split(',').map(Number);
					this.params.districts.name=[];

				}
			}
		}



		let d = new Date();
		
		if (this.curDate) {
			if(moment(d).isSameOrAfter(this.curDate, 'day')) {
				if (d.getHours() < 23){
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
					if (d.getHours() < 23)
						this.curDate = moment(d).format("YYYYMMDD");
					else
						this.curDate = moment(d).add(1, 'd').format("YYYYMMDD");
				this.selectedDate = moment(this.curDate);
			}
		} else 
			this.curDate = moment(d).format("YYYYMMDD");


		this.httpService.getCategories().subscribe((data:any) => {
			this.categories=data.categories;
			if(!this.curCategory)
				this.curCategory = 0;
			this.eventsFilter();
		});
		this.monday= moment(this.monday).startOf('week');
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
		if (this.params.districts.id && this.params.districts.id.length) {
			getParams.district_ids = this.params.districts.id;
		}
		if (this.params.metro.id && this.params.metro.id.length) {
			getParams.metro_ids = this.params.metro.id;
		}
		localStorage.setItem('category', JSON.stringify(this.curCategory));
		localStorage.setItem('date', this.curDate);
		localStorage.setItem('params', JSON.stringify(getParams));

		if (window.location.hash) 
			this.hash = window.location.hash;
		let filterUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
		let search = '?';
		for (let key in getParams) {
			search += key+'='+getParams[key]+'&';
		}
		search += 'category_id=' + this.curCategory + '&date=' + this.curDate;
		filterUrl += search;
		window.history.pushState({path:filterUrl},'',filterUrl);

		this.httpService.getSchedule(this.curCategory, this.curDate, getParams).subscribe((data:any) => {
			this.events = [];
			if(data.results > 0) {
				this.parseActivities(data);
			}
			this.resultsToShow = 8;
			if (this.hash) {
				let pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({document: this.document, scrollTarget: this.hash, pageScrollDuration: 1000});
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
		if (this.week <= 30) {
			this.monday.add(7,'d');
			this.initDates();
			this.week += 7;
		}
	}

	lastWeek(event:any) : void {
		if (this.week > 7) {
			this.monday.subtract(7,'d')
			this.initDates();
			this.week -= 7;
		}
	}

	parseActivities(data: any) : void {
		for( let item in data.activities) {
			for( let location in data.activities[item].locations) {
				for (let time in data.activities[item].locations[location].time_slots) {
					this.events.push({
						'id': data.activities[item].id,
						'name': data.activities[item].name,
						'description': data.activities[item].description,
						'photo': data.activities[item].photo,
						'duration': data.activities[item].duration,
						'age_from': data.activities[item].age_from,
						'age_to': data.activities[item].age_to,
						'extra': data.activities[item].extra,
						'locations': {
							'id': data.activities[item].locations[location].id,
							'address': data.activities[item].locations[location].address,
							'latitude': data.activities[item].locations[location].latitude,
							'longitude': data.activities[item].locations[location].longitude,
							'time_slots':{
								'id': data.activities[item].locations[location].time_slots[time].id,
								'date': data.activities[item].locations[location].time_slots[time].date,
								'start_time': data.activities[item].locations[location].time_slots[time].start_time,
								'end_time': data.activities[item].locations[location].time_slots[time].end_time,
								'free_seats': data.activities[item].locations[location].time_slots[time].free_seats,
								'allocated_seats': data.activities[item].locations[location].time_slots[time].allocated_seats,
								'price': data.activities[item].locations[location].time_slots[time].price
							}
						},
						'provider': {
							'id': data.activities[item].provider.id,
							'name': data.activities[item].provider.name,
							'legal': {
								'contract_date': data.activities[item].provider.legal.contract_date,
								'legal_name': data.activities[item].provider.legal.legal_name,
								'contact_phone': data.activities[item].provider.legal.contact_phone,
								'contact_email': data.activities[item].provider.legal.contact_email,
								'tax_num': data.activities[item].provider.legal.tax_num,
							}
						}
					});
				}
			}
		}
	}
	
	districtsFilter(districts:any) : void {
		this.params.districts = districts;
		this.params.metro = {};
		this.eventsFilter();
	}

	metroFilter(metro:any) : void {
		this.params.districts = {};
		this.params.metro = metro;
		this.eventsFilter();
	}	

	declOfNum(number:number, titles:string[]) : string {  
			let cases = [2, 0, 1, 1, 1, 2];  
			return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
	}
			
	openCourse(course:any) {
	    this.router.navigateByUrl(`/event/${course.id}`);
	}

}