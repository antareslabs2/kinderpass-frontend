import { Component } from '@angular/core';


@Component({
	selector: 'contacts',
	templateUrl: '../static/contacts.html'
})

export class ContactsComponent { 
  
	innerpage:boolean;

	constructor(){
		this.innerpage = true;
	}

}