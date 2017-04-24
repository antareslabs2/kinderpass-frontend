import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpService} from './http.service';

@Component({
  selector: 'app-dialog',
  templateUrl: 'loginPopup.html',
  animations: [
    trigger('dialog', [
      transition('void => *', [
        animate(300, style({ opacity: '1' }))
      ]),
      transition('* => void', [
        animate(300, style({ opacity: '0' }))
      ])
    ])
  ]
})
export class DialogComponent implements OnInit {
  count: {};
  districtsNames:string[];
  metroStations:string[];
  districts:any;
  metro:any;

  @Input() visible: string;
  @Input() event: any;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() districtsFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() metroFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private httpService: HttpService) {
    this.count = {'districts':0,'metro':0};
    this.districts = {};
    this.metro = {};
    this.districtsNames = [ "Адмиралтейский", "Василеостровский", "Выборгский", "Калининский", "Кировский", "Колпинский", "Красногвардейский", "Красносельский", "Кронштадтский", "Курортный", "Московский", "Невский", "Петроградский", "Петродворцовый", "Приморский", "Пушкинский", "Фрунзенский", "Центральный", "Павловский", "Ломоносовский" ];
     this.metroStations = [ "Ладожская", "Проспект Большевиков", "Улица Дыбенко", "Елизаровская", "Ломоносовская", "Пролетарская", "Обухово", "Рыбацкое", "Новочеркасская", "Лиговский проспект", "Площадь Александра Невского 2", "Площадь Александра Невского 1", "Бухарестская", "Международная", "Волковская", "Обводный канал 1", "Фрунзенская", "Московские ворота", "Электросила", "Парк Победы", "Московская", "Звездная", "Купчино", "Звенигородская", "Пушкинская", "Владимировская", "Достоевская", "Спасская", "Маяковская", "Гостиный двор", "Площадь Восстания", "Садовая", "Сенная площадь", "Технологический институт 1", "Технологический институт 2", "Невский проспект", "Балтийская", "Кировский завод", "Нарвская", "Автово", "Ленинский проспект", "Проспект Ветеранов", "Адмиралтейская", "Василеостровская", "Приморская", "Спортивная", "Чкаловская", "Горьковская", "Петроградская", "Черная речка", "Пионерская", "Удельная", "Крестовский остров", "Комендантский проспект", "Старая деревня", "Озерки", "Парнас", "Проспект просвещения", "Площадь Мужества", "Политехническая", "Академическая", "Гражданский проспект", "Девяткино", "Чернышевская", "Площадь Ленина", "Выборгская", "Лесная" ];
   }

  ngOnInit() {
    for (let i in this.districtsNames) {
        let tmp = {};
        this.districts[this.districtsNames[i]] = {
          'selected':false,
          'active': false
        };
    }

    this.httpService.getDistricts().subscribe((data:any) => {
      if( data.status = "OK") {
        for(let i in data.districts) {
          if (this.districts.hasOwnProperty(data.districts[i].name)) {
             this.districts[data.districts[i].name].active = true;
             this.districts[data.districts[i].name].id = data.districts[i].id;
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
      if( data.status = "OK") {
        for(let i in data.metro) {
          if (this.metro.hasOwnProperty(data.metro[i].name)) {
             this.metro[data.metro[i].name].active = true;
             this.metro[data.metro[i].name].id = data.metro[i].id;
          }
        }
      }
    });
  }

  close() {
    this.visible = '';
    this.visibleChange.emit(false);
  }

  applyDistricts() {
    let selected:number[] = [];
    for (let district in this.districts) {
        if(this.districts[district].selected)
          selected.push(this.districts[district].id);
    }
    this.districtsFilter.emit(selected);
    this.close();
  }

  applyMetro() {
    let selected:number[] = [];
    for (let metro in this.metro) {
        if(this.metro[metro].selected)
          selected.push(this.metro[metro].id);
    }
    this.metroFilter.emit(selected);
    this.close();
  }

  makingBooking(timeSlotID:number, seats:number) {
    
    this.httpService.makingBooking(timeSlotID,seats).subscribe((data:any) => {
        console.log(data)
      });;
  }

  declOfNum(number:number, titles:string[]) {  
      let cases = [2, 0, 1, 1, 1, 2];  
      return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
  }

  toggleDistrict(name:string) {
    if (this.districts[name].active) {
      this.count.districts -= this.districts[name].selected;
      this.districts[name].selected = !this.districts[name].selected;
      this.count.districts += this.districts[name].selected;
    }
  }

  toggleMetro(name:string) {
    if (this.metro[name].active) {
      this.count.metro -= this.metro[name].selected;
      this.metro[name].selected = !this.metro[name].selected;
      this.count.metro += this.metro[name].selected;
    }
  }

  resetDistricts() {
    this.count.districts = 0;
    for (let district in this.districts) {
        this.districts[district].selected = false;
    }
    for (let metro in this.metro) {
        this.metro[metro].selected = false;
    }
  }

  resetMetro() {
    this.count.metro = 0;

    for (let metro in this.metro) {
        this.metro[metro].selected = false;
    }
  }

}