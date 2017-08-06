import { Component } from '@angular/core';


@Component({
	selector: 'policy',
	templateUrl: `../static/policy.html?v=${new Date().getTime()}`
})

export class PolicyComponent { 
  
	innerpage:boolean;

	constructor(){
		this.innerpage = true;
	}

}