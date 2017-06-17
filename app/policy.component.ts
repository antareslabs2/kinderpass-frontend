import { Component } from '@angular/core';


@Component({
	selector: 'policy',
	templateUrl: 'static/policy.html'
})

export class PolicyComponent { 
  
	innerpage:boolean;

	constructor(){
		this.innerpage = true;
	}

}