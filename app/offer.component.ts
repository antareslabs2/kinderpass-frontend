import { Component } from '@angular/core';


@Component({
	selector: 'offer',
	templateUrl: `../static/offer.html?v=${new Date().getTime()}`
})

export class OfferComponent{ 
  	
  	innerpage:boolean;

	constructor(){
		this.innerpage = true;
	}

}