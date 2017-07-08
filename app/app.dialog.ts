import { Component, Inject } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GlobalService } from './app.global.service';

@Component({
  selector: 'app-dialog',
  templateUrl: 'static/loginPopup.html',
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
export class DialogComponent {
  email:string;
  phone:string;
  apiURL:string;

  constructor(private gs: GlobalService, @Inject(Window) private _window: Window) {
    if(this._window.location.hostname == 'kinderpass.ru')
      this.apiURL = 'https://api.kinderpass.ru/';
    else if (this._window.location.hostname == 'localhost')
      this.apiURL = 'http://dev.kinderpass.ru:8000/';
    else
      this.apiURL = 'https://test.kinderpass.ru/';

   }

  close() : void {
    this.gs.popupName = '';
    $("html").removeClass('locked');
  }

  update(form:any) : void {
    this.gs.update(form);
  }

}