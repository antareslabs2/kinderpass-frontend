import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
  orderForm: FormGroup;

  @Input() visible: string;
  @Input() event: any;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder, private httpService: HttpService) { }

  ngOnInit() { 
    this.orderForm = new FormGroup({
       sum: new FormControl()
    });
  }

  close() {
    this.visible = '';
    this.visibleChange.emit(this.visible);
  }

  paykeeper() {
    this.orderForm.controls['sum'].setValue(this.event.locations.time_slots.price);
    
    let dat = this.httpService.testing(JSON.stringify(this.orderForm.value));
  }
}