import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() { }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}