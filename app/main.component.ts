import { Component, OnInit, Inject } from '@angular/core';
import { Api } from './api.service';
import { GlobalService } from './app.global.service';
import { ActivatedRoute, Router } from "@angular/router";
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import {DOCUMENT} from '@angular/platform-browser';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';

declare var device: any;
declare var ga:Function;

@Component({
	selector: 'main-app',
	templateUrl: `../static/main.html?v=${new Date().getTime()}`,
	providers: [Api],
	animations: [
		trigger('slideToggleH', [
			state('1' , style({ 
				height: '410px', 
				marginTop: "20px",
				visibility: "visible"
			})),
			state('0', style({ 
				height: 0,
				marginTop: 0,
				visibility: "hidden"
			})),
			transition('1 => 0', animate(150)),
			transition('0 => 1', animate('0.1s 150ms ease-out'))
		]),
		trigger('slideToggleW', [
			state('1' , style({ 
				width: "315px", 
				left: "5px", 
				backgroundColor: "#1cbbb4"
			})),
			state('0', style({ 
				width: "100%", 
				left: "0", 
				backgroundColor: "#9a8ac1"
			})),
			transition('1 => 0', animate('0.1s 150ms ease-out')),
			transition('0 => 1', animate(150))
		])
	]
})

export class MainComponent implements OnInit { 

	events:any;

	monday: any;
	
	desktop : boolean;

	constructor(private router:Router, private readonly route: ActivatedRoute, private gs:GlobalService, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any){
		this.gs.innerpage = false;

		this.events = [];

		this.desktop = device.desktop();

	}

	ngOnInit(){
		this.gs.innerpage = false;
		this.monday= moment(new Date()).startOf('week');
		this.events = [ {
				id: '',
				photo: '1',
				name: 'Сказка «Русалочка» в театре Мюзик-Холл» 6+',
				description: 'Студия творческого роста «Оранжерея» обучает детей и взрослых лепке и рисованию с использованием самых современных материалов! На мастер-классе вы познакомитесь с замечательной полимерной глиной,',
				locations: [ {
					address: 'Театр «Мюзик-Холл», Александровский парк, д. 4М',
					metro: {
						name: 'Кировский завод',
						line: 1
					}
				} ],
				time: '12-00',
				date: 'Пн, 6 ноября'
			}, {
				id: '',
				photo: '2',
				name: 'Концерт «Джаз для дошкольников» 0+',
				description: 'Развивающие занятия для малышей с мамами. Знакомство с окружающим миром через познание новых форм, цветов и материалов, сравнение количеств и размеров, взаимодействие с другими малышами способствуют б...',
				locations: [ {
					address: 'Филармония джазовой музыки, Загородный пр., д. 27',
					metro: {
						name: 'Комендантский проспект',
						line: 5
					}
				} ],
				time: '14-00',
				date: 'Ср, 8 ноября'
			}, {
				id: '',
				photo: '3',
				name: 'Курс рисования «Научиться рисовать за 15 занятий» ',
				description: 'Мир красок и кистей, что может быть прекрасней. Это мир переживаний и улыбок, счастья, мыслей и фантазий. ',
				locations: [ {
					address: 'Творческая мастерская «Рисовальщик»',
					metro: {
						name: 'Улица Дыбенко',
						line: 4
					}
				} ],
				time: '15-30',
				date: 'Чт, 9 ноября'
			}, {
				id: '',
				photo: '4',
				name: 'Фестиваль «Дни Ирландии в Тимирязевке» 6+',
				description: 'Художественная гимнастика – один из самых разносторонних и гармоничных видов спорта. Занятия способствую всестороннему физическому развитию занимающихся, формируют красоту и грациозность движений, пла...',
				locations: [ {
					address: 'Библиотека им. К. А. Тимирязева',
					metro: {
						name: 'Московская',
						line: 2
					}
				} ],
				time: '15-30',
				date: 'Сб, 11 ноября'
			}, {
				id: '',
				photo: '5',
				name: 'Примавера роботикс',
				description: '"Республика кошек" на Якубовича, 10 — первое в России котокафе и центр Котокультурной столицы страны с 2011 года. Филиал первого в России Музея Кошки. ​Если ваш ребёнок любит животных, то кототера...',
				locations: [ {
					address: 'Примавера роботикс, ул. Политехническая, д. 29',
					metro: {
						name: 'Старая деревня',
						line: 5
					}
				} ],
				time: '18-40',
				date: 'Сб, 11 ноября'
			}, {
				id: '',
				photo: '6',
				name: 'Музей «Гранд макет Россия»',
				description: 'Какие факторы влияют на успешность ребенка в учёбе и в жизни? Это интеллект, умение решать задачи, успешность в общении, умение концентрировать внимание.',
				locations: [ {
					address: 'ул. Цветочная, д. 25',
					metro: {
						name: 'Звездная',
						line: 2
					}
				} ],
				time: '10-20',
				date: 'Вс, 12 ноября'
			}, {
				id: '',
				photo: '7',
				name: 'Большой Санкт-Петербургский цирк 0+',
				description: 'Интересные, развивающие занятия способствуют всестороннему и гармоничному развитию ребенка и направлены на: развитие психических процессов у детей (памяти, мышления, речи, воображения), формирован...',
				locations: [ {
					address: 'наб. р. Фонтанки, д. 3/А',
					metro: {
						name: 'Новочеркасская',
						line: 4
					}
				} ],
				time: '19-00',
				date: 'Вс, 12 ноября'
			}
		];
	}

	goToEvent(id: number){
		// this.router.navigate(['/'], {fragment: 'event_'+id, queryParams: this.gs.url, relativeTo: this.route, });
		// setTimeout(()=>{
		// 	this.router.navigate(['/event', this.curDate, id]);
		// });
	}
}