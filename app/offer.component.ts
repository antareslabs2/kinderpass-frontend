import { Component } from '@angular/core';


@Component({
	selector: 'offer',
	templateUrl: 'offer.html'
})

export class OfferComponent{ 
  	
  	innerpage:boolean;

	constructor(){
		this.innerpage = true;
	}

}