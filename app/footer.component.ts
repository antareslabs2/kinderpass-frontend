import { Component, HostListener } from '@angular/core';


@Component({
	selector: 'footerTemplate',
	templateUrl: `static/footer.html?v=${new Date().getTime()}`
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