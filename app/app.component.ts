import { Component, OnInit } from '@angular/core';
import { HttpService} from './http.service';

import * as $ from 'jquery';
import 'slick';

@Component({
	selector: 'my-app',
	templateUrl: 'main.html',
	// styleUrls: ['app/js/slick/slick.css', 'app/js/slick/slick-theme.css', 'app/css/styles.css' ],
	providers: [HttpService],
	host: {
		'(window:resize)': 'onResize($event)'
   }
})

export class AppComponent implements OnInit { 
  
	categories:any;
	events:any;
	selectedEvent:any;
	dates:any[];
	months:string[];
	ages:any[];
	monday: any;
	weekday:number;
	times: any;
	selectedDate:string;
	resultsToShow:number;
	openPopup: string;
	isAuthenticated: boolean;
	
	curDate:string;
	curCategory : number;
	age_from:number;
	age_to:number;
	time_from:number;
	time_to:number;

	constructor(private httpService: HttpService){
		this.selectedEvent = {
			"name":'test',
			'photo':"app/img/results1.jpg",
			'duration': "90",
			"description":"17.03 в 18.00 – Кинопоказ фильма «Бруклин» на языке оригинала в честь Дня Святого Патрика \
18.03 в 13.30 – Детский кинопоказ ирландского мультфильма «Тайна Келлс» \
18.03 в 14.50 – Мастер-класс «Четырёхлистник на удачу» по изготовлению бумажного клевера-четырёхлистника в технике оригами \
18.03 в 16.20 - мастер-класс Андрея Касьяненко «Фенечка в кельтском стиле» по плетению браслета из мулине (нитки-мулине зелёного и других цветов взять с собой)\
24.03 в 17.30- мастер-класс «Талисман удачи» (крючок и нитки взять с собой)",
			"locations": {
				"address": "Библиотека им. К. А. Тимирязева",
				"time_slots": {
					"start_time" : "12:00",
					"date": "9 апреля 2017",
					'free_seats': 4,
					"price" : 3
				}
			}
		};
		this.isAuthenticated = false;
		this.openPopup = '';
		this.resultsToShow = 1;
		this.monday = new Date();
		this.selectedDate = new Date().toDateString();
		this.events = [];
		this.dates = [];
		this.months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
		this.ages = [[0,2],[3,5],[6,9],[10,14]];
		this.times = [
			{
				"key":"День",
				"time_from":0,
				"time_to": 12
			},
			{
				"key":"Вечер",
				"time_from":13,
				"time_to": 24
			},
			{
				"key":"Весь день",
				"time_from":0,
				"time_to": 24
			}
		];
	}

	ngOnInit(){
		this.httpService.getInfo().subscribe((data:any) => {
			if(data.status == 'ERROR') {
				this.isAuthenticated = false;
			} else {
				this.isAuthenticated = true;
			}
		});
		let d = new Date();
		this.weekday = d.getDay()-1;
		this.curDate = d.getFullYear().toString() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2);
		this.initSlider();
		this.httpService.getCategories().subscribe((data:any) => {
			this.categories=data.categories;
			this.curCategory = this.categories.filter((item: any)=> item.name === 'Киндерпасс')[0]['id'];
			this.httpService.getSchedule(this.curCategory, this.curDate, {}).subscribe((data:any) => {
				if(data.results > 0) {
					this.events = data;
				}
			});
		});
		// 
		let day = this.monday.getDay() || 7;
		if( day !== 1 ) 
			this.monday.setHours(-24 * (day-1));
		// 
		this.initDates();

	}

	initDates() {
		this.dates[0] = {
			"date" : this.monday.toDateString(),
			"filter" : this.monday.getFullYear().toString() + ("0" + (this.monday.getMonth() + 1)).slice(-2) + ("0" + this.monday.getDate()).slice(-2),
			"month" : this.monday.getDate() + ' ' + this.months[this.monday.getMonth()]
		};
		for(let i=1; i<7; i++) {
			let d = new Date(this.monday);
			d.setDate(d.getDate() + i);
			this.dates[i] = {
				"date" : d.toDateString(),
				"filter" : d.getFullYear().toString() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2),
				"month" : d.getDate() + ' ' + this.months[d.getMonth()]
			};
		}
	}

	initSlider() {
		if($('.slider').length) {
			$('.slider').slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: true,
				dots: true,
				fade: true,
				prevArrow: $('.slider-arrow-prev'),
				nextArrow: $('.slider-arrow-next')
			});
		}
		if($('.advantages-slider').length) {
			if ($(window).width() <= 420) {
				$('.advantages-slider').slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
					dots: true
				});
			} else {
				if ($('.advantages-slider').hasClass('slick-initialized')) {
					$('.advantages-slider').slick('unslick');
				}
			}
		}
		if($('.steps-wrap').length) {
			if ($(window).width() <= 420) {
				$('.steps-wrap').slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
					dots: true
				});
			} else {
				if ($('.steps-wrap').hasClass('slick-initialized')) {
					$('.steps-wrap').slick('unslick');
				}
			}
		}
	}

	onResize(event:any){
		if($('.advantages-slider').length) {
			if ($(window).width() <= 420) {
				if (!$('.advantages-slider').hasClass('slick-initialized')) {
					$('.advantages-slider').slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						arrows: false,
						dots: true
					});
				}
			} else {
				if ($('.advantages-slider').hasClass('slick-initialized')) {
					$('.advantages-slider').slick('unslick');
				}
			}
		}
		if($('.steps-wrap').length) {
			if ($(window).width() <= 420) {
				if (!$('.steps-wrap').hasClass('slick-initialized')) {
					$('.steps-wrap').slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						arrows: false,
						dots: true
					});
				}
			} else {
				if ($('.steps-wrap').hasClass('slick-initialized')) {
					$('.steps-wrap').slick('unslick');
				}
			}
		}
	}

	filterByDate(event:any) {
		if ($(event.target).hasClass('week-day')) {
			$(event.target).siblings().removeClass('filters-option-active');
			$(event.target).addClass('filters-option-active');
		} else {
			$(event.target).parents('.week-day').siblings().removeClass('filters-option-active');
			$(event.target).parents('.week-day').addClass('filters-option-active');
		}
		this.httpService.getSchedule(this.curCategory, this.curDate, {}).subscribe((data:any) => {
			if(data.results > 0) {
				this.events = data;
			}
			this.resultsToShow = 1;
		});
	}

	filterByOption(event:any) {
		let getParams:any = {};
		if (this.age_from != undefined)
			getParams.age_from = this.age_from;
		if (this.age_to != undefined)
			getParams.age_to = this.age_to;
		if (this.time_from != undefined)
			getParams.time_from = this.time_from;
		if (this.time_to != undefined)
			getParams.time_to = this.time_to;
		$(event.target).siblings().removeClass('filters-option-active');
		$(event.target).addClass('filters-option-active');
		this.httpService.getSchedule(this.curCategory, this.curDate, getParams).subscribe((data:any) => {
			if(data.results > 0) {
				this.events = data;
			}
			this.resultsToShow = 1;
		});
	}

	nextWeek(event:any) {
		this.monday.setDate( this.monday.getDate() + 7)
		this.initDates();
	}

	lastWeek(event:any) {
		this.monday.setDate( this.monday.getDate() - 7)
		this.initDates();
	}
				
}