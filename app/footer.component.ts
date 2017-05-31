import { Component, HostListener } from '@angular/core';


@Component({
	selector: 'footerTemplate',
	templateUrl: 'footer.html'
})

export class FooterComponent { 
  
	@HostListener('window:scroll', ['$event']) onScrollEvent($event:any){
		if ($(window).scrollTop() > $(window).height()/2) {
			$('.arrow').fadeIn();
		}
		else {
			$('.arrow').fadeOut();
		}
	} 

	constructor(){

	}
}