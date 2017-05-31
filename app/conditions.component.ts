import { Component } from '@angular/core';


@Component({
	selector: 'conditions',
	templateUrl: 'conditions123/index.html'
})

export class ConditionsComponent { 
  
	innerpage:boolean;

	constructor(){
		this.innerpage = true;
	}

}