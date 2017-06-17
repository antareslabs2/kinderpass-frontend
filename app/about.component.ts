import { Component } from '@angular/core';

@Component({
	selector: 'about',
	templateUrl: 'static/about.html'
})

export class AboutComponent{ 
  
	innerpage:boolean;
	
	constructor(){
		this.innerpage = true;	
	}

}