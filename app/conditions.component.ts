import { Component } from '@angular/core';


@Component({
	selector: 'conditions',
	templateUrl: `../static/conditions.html?v=${new Date().getTime()}`
})

export class ConditionsComponent { 
  
	innerpage:boolean;

	constructor(){
		this.innerpage = true;
	}

}