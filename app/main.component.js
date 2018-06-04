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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var api_service_1 = require("./api.service");
var app_global_service_1 = require("./app.global.service");
var router_1 = require("@angular/router");
var ng2_page_scroll_1 = require("ng2-page-scroll");
var platform_browser_1 = require("@angular/platform-browser");
var animations_1 = require("@angular/animations");
var moment = require("moment");
var MainComponent = (function () {
    function MainComponent(router, route, gs, pageScrollService, document) {
        this.router = router;
        this.route = route;
        this.gs = gs;
        this.pageScrollService = pageScrollService;
        this.document = document;
        this.gs.innerpage = false;
        this.events = [];
        this.desktop = device.desktop();
    }
    MainComponent.prototype.ngOnInit = function () {
        this.gs.innerpage = false;
        this.monday = moment(new Date()).startOf('week');
        this.sunday = moment(new Date()).startOf('week');
        this.events = [{
                id: '',
                photo: '1',
                name: 'Сказка «Русалочка» в театре Мюзик-Холл» 6+',
                description: 'Студия творческого роста «Оранжерея» обучает детей и взрослых лепке и рисованию с использованием самых современных материалов! На мастер-классе вы познакомитесь с замечательной полимерной глиной,',
                locations: [{
                        address: 'Театр «Мюзик-Холл», Александровский парк, д. 4М',
                        metro: {
                            name: 'Кировский завод',
                            line: 1
                        }
                    }],
                time: '12-00',
                date: this.sunday.format()
            }, {
                id: '',
                photo: '2',
                name: 'Концерт «Джаз для дошкольников» 0+',
                description: 'Развивающие занятия для малышей с мамами. Знакомство с окружающим миром через познание новых форм, цветов и материалов, сравнение количеств и размеров, взаимодействие с другими малышами способствуют б...',
                locations: [{
                        address: 'Филармония джазовой музыки, Загородный пр., д. 27',
                        metro: {
                            name: 'Комендантский проспект',
                            line: 5
                        }
                    }],
                time: '14-00',
                date: this.sunday.add(1, 'days').format()
            }, {
                id: '',
                photo: '3',
                name: 'Курс рисования «Научиться рисовать за 15 занятий» ',
                description: 'Мир красок и кистей, что может быть прекрасней. Это мир переживаний и улыбок, счастья, мыслей и фантазий. ',
                locations: [{
                        address: 'Творческая мастерская «Рисовальщик»',
                        metro: {
                            name: 'Улица Дыбенко',
                            line: 4
                        }
                    }],
                time: '15-30',
                date: this.sunday.add(3, 'days').format()
            }, {
                id: '',
                photo: '4',
                name: 'Фестиваль «Дни Ирландии в Тимирязевке» 6+',
                description: 'Художественная гимнастика – один из самых разносторонних и гармоничных видов спорта. Занятия способствую всестороннему физическому развитию занимающихся, формируют красоту и грациозность движений, пла...',
                locations: [{
                        address: 'Библиотека им. К. А. Тимирязева',
                        metro: {
                            name: 'Московская',
                            line: 2
                        }
                    }],
                time: '15-30',
                date: this.sunday.add(1, 'days').format()
            }, {
                id: '',
                photo: '5',
                name: 'Примавера роботикс',
                description: '"Республика кошек" на Якубовича, 10 — первое в России котокафе и центр Котокультурной столицы страны с 2011 года. Филиал первого в России Музея Кошки. ​Если ваш ребёнок любит животных, то кототера...',
                locations: [{
                        address: 'Примавера роботикс, ул. Политехническая, д. 29',
                        metro: {
                            name: 'Старая деревня',
                            line: 5
                        }
                    }],
                time: '18-40',
                date: this.sunday.format()
            }, {
                id: '',
                photo: '6',
                name: 'Музей «Гранд макет Россия»',
                description: 'Какие факторы влияют на успешность ребенка в учёбе и в жизни? Это интеллект, умение решать задачи, успешность в общении, умение концентрировать внимание.',
                locations: [{
                        address: 'ул. Цветочная, д. 25',
                        metro: {
                            name: 'Звездная',
                            line: 2
                        }
                    }],
                time: '10-20',
                date: this.sunday.add(1, 'days').format()
            }, {
                id: '',
                photo: '7',
                name: 'Большой Санкт-Петербургский цирк 0+',
                description: 'Интересные, развивающие занятия способствуют всестороннему и гармоничному развитию ребенка и направлены на: развитие психических процессов у детей (памяти, мышления, речи, воображения), формирован...',
                locations: [{
                        address: 'наб. р. Фонтанки, д. 3/А',
                        metro: {
                            name: 'Новочеркасская',
                            line: 4
                        }
                    }],
                time: '19-00',
                date: this.sunday.format()
            }
        ];
    };
    MainComponent.prototype.goToEvent = function (id) {
        // this.router.navigate(['/'], {fragment: 'event_'+id, queryParams: this.gs.url, relativeTo: this.route, });
        // setTimeout(()=>{
        // 	this.router.navigate(['/event', this.curDate, id]);
        // });
    };
    return MainComponent;
}());
MainComponent = __decorate([
    core_1.Component({
        selector: 'main-app',
        templateUrl: "../static/main.html?v=" + new Date().getTime(),
        providers: [api_service_1.Api],
        animations: [
            animations_1.trigger('slideToggleH', [
                animations_1.state('1', animations_1.style({
                    height: '410px',
                    marginTop: "20px",
                    visibility: "visible"
                })),
                animations_1.state('0', animations_1.style({
                    height: 0,
                    marginTop: 0,
                    visibility: "hidden"
                })),
                animations_1.transition('1 => 0', animations_1.animate(150)),
                animations_1.transition('0 => 1', animations_1.animate('0.1s 150ms ease-out'))
            ]),
            animations_1.trigger('slideToggleW', [
                animations_1.state('1', animations_1.style({
                    width: "315px",
                    left: "5px",
                    backgroundColor: "#1cbbb4"
                })),
                animations_1.state('0', animations_1.style({
                    width: "100%",
                    left: "0",
                    backgroundColor: "#9a8ac1"
                })),
                animations_1.transition('1 => 0', animations_1.animate('0.1s 150ms ease-out')),
                animations_1.transition('0 => 1', animations_1.animate(150))
            ])
        ]
    }),
    __param(4, core_1.Inject(platform_browser_1.DOCUMENT)),
    __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, app_global_service_1.GlobalService, ng2_page_scroll_1.PageScrollService, Object])
], MainComponent);
exports.MainComponent = MainComponent;
//# sourceMappingURL=main.component.js.map