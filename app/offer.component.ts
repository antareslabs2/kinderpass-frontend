import { Component } from '@angular/core';


@Component({
	selector: 'offer',
	templateUrl: 'static/offer.html'
})

export class OfferComponent{ 
  	
  	innerpage:boolean;

	constructor(){
		this.innerpage = true;
	}

}