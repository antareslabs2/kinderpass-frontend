import { Component } from '@angular/core';


@Component({
	selector: 'contacts',
	templateUrl: `../static/contacts.html?v=${new Date().getTime()}`
})

export class ContactsComponent { 
  
	innerpage:boolean;

	constructor(){
		this.innerpage = true;
	}

}