import { Component} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GlobalService } from './app.global.service';

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
export class DialogComponent {
  email:string;
  phone:string;

  constructor(private gs: GlobalService) {
   }

  close() : void {
    this.gs.popupName = '';
    $("html").removeClass('locked');
  }

  update(form:any) : void {
    this.gs.update(form);
  }

}