import { Component, OnInit} from '@angular/core';
import { Response} from '@angular/http';
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
	dates:any[];
	months:any[];
	ages:any[];
	monday: any;
	weekday:any;
	times: any;
	selectedDate:any;
	resultsToShow:number;
	
	curDate:any;
	curCategory : any;
	age_from:number;
	age_to:number;
	time_from:number;
	time_to:number;
	constructor(private httpService: HttpService){
		this.resultsToShow = 1;
		this.monday = new Date();
		this.selectedDate = new Date().toDateString();
		this.events = {"events": [{
				'id': 1,
				'activity': {
					'id': 1,
					'name': 'testtest test',
					'description': 'testtest testtesttest test',
					'photo':"app/img/results1.jpg",
					'price': 5,
					'duration': 90,
					'location': {
						'id': 1,
						'address': "Театр «Мюзик-Холл», Александровский парк, д. 4М",
						'latitude': 1,
						'longitude': 1
					},
					'provider': {
						'id': 1,
						'name': "????"
					}
				},
				'start_time': "12:00",
				'slots': 1
			},{
				'id': 1,
				'activity': {
					'id': 1,
					'name': 'testtest test',
					'description': 'testtest testtesttest test',
					'photo':"app/img/results1.jpg",
					'price': 5,
					'duration': 90,
					'location': {
						'id': 1,
						'address': "Театр «Мюзик-Холл», Александровский парк, д. 4М",
						'latitude': 1,
						'longitude': 1
					},
					'provider': {
						'id': 1,
						'name': "????"
					}
				},
				'start_time': "12:00",
				'slots': 1
			},{
				'id': 1,
				'activity': {
					'id': 1,
					'name': 'testtest test',
					'description': 'testtest testtesttest test',
					'photo':"app/img/results1.jpg",
					'price': 5,
					'duration': 90,
					'location': {
						'id': 1,
						'address': "Театр «Мюзик-Холл», Александровский парк, д. 4М",
						'latitude': 1,
						'longitude': 1
					},
					'provider': {
						'id': 1,
						'name': "????"
					}
				},
				'start_time': "12:00",
				'slots': 1
			}]
		};
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
		let d = new Date();
		this.weekday = d.getDay()-1;
		this.curDate = d.getFullYear().toString() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2);
		this.initSlider();
		this.httpService.getCategories().subscribe((data:any) => {
			this.categories=data.categories;
			this.curCategory = this.categories.filter((item: any)=> item.name === 'Киндерпасс')[0]['id'];
			this.httpService.getSchedule(this.curCategory, this.curDate).subscribe((data:any) => {
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
		this.httpService.getSchedule(this.curCategory, this.curDate).subscribe((data:any) => {
			if(data.results > 0) {
				this.events = data;
			}
			this.resultsToShow = 1;
		});
	}

	filterByOption(event:any) {
		console.log(this.curDate);
		console.log(this.curCategory);
		console.log(this.age_from);
		console.log(this.age_to);
		console.log(this.time_from);
		console.log(this.time_to);
		$(event.target).siblings().removeClass('filters-option-active');
		$(event.target).addClass('filters-option-active');
		this.httpService.getSchedule(this.curCategory, this.curDate).subscribe((data:any) => {
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