import { Component } from '@angular/core';

@Component({
	selector: 'about',
	templateUrl: `../static/about.html?v=${new Date().getTime()}`
})

export class AboutComponent{ 
  
	innerpage:boolean;
	
	constructor(){
		this.innerpage = true;	
	}

}