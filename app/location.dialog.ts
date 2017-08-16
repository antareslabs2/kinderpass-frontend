import { Component, Input, Output, EventEmitter} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GlobalService } from './app.global.service';

@Component({
  selector: 'location-dialog',
  templateUrl: `../static/location.html?v=${new Date().getTime()}`,
  animations: [
    trigger('location-dialog', [
      transition('void => *', [
        animate(300, style({ opacity: '1' }))
      ]),
      transition('* => void', [
        animate(300, style({ opacity: '0' }))
      ])
    ])
  ]
})
export class LocationComponent {
  selectedVal: any;
  @Input() districts:any;
  @Input() metro:any;
  @Output() districtsFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() metroFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private gs: GlobalService) {
   }

  close() : void {
    this.gs.popupName = '';
    $("html").removeClass('locked');
  }

  applyDistricts() : void {
    let selected:any = {'id':[],'name':[]};
    for (let district in this.districts) {
        if(this.districts[district].selected){
          selected.id.push(this.districts[district].id);
          selected.name.push(district);
        }
    }
    this.districtsFilter.emit(selected);
    // this.close();
  }

  applyMetro() : void {
    let selected:any = {'id':[],'name':[]};
    for (let metro in this.metro) {
        if(this.metro[metro].selected) {
          selected.id.push(this.metro[metro].id);
          selected.name.push(metro);
        }
    }
    this.metroFilter.emit(selected);
  }

  toggleDistrict(name:string) : void {
    console.log(name)
    if (this.districts[name].active) {
      this.districts[name].selected = !this.districts[name].selected;
    }
    this.applyDistricts();
  }

  toggleMetro(name:string) : void {
    if (this.metro[name].active) {
      this.metro[name].selected = !this.metro[name].selected;
    }
    this.applyMetro();
  }

  resetDistricts() : void {
    for (let district in this.districts) {
        this.districts[district].selected = false;
    }
    this.applyDistricts();
  }

  resetMetro() : void {

    for (let metro in this.metro) {
        this.metro[metro].selected = false;
    }
    this.applyMetro();
  }

  toggleLocation(event: any): void {
      this.toggleDistrict(event[0].name)
  }
}