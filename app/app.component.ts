import { Component, OnInit} from '@angular/core';
import { Response} from '@angular/http';
import { HttpService} from './http.service';

import * as $ from 'jquery';
import 'slick';

@Component({
    selector: 'my-app',
    templateUrl: 'main.html',
    // styleUrls: ['app/js/slick/slick.css', 'app/js/slick/slick-theme.css', 'app/css/styles.css' ],
    providers: [HttpService],
    host: {
    	'(window:resize)': 'onResize($event)'
   }
})

export class AppComponent implements OnInit { 
  
    constructor(private httpService: HttpService){}
    categories:any;
    date:any;

    private category : any;

    ngOnInit(){
    	this.date = new Date().toLocaleString('ru');;
        this.initSlider();
        this.httpService.getCategories().subscribe((data:any) => {this.categories=data.categories;});
    }

    initSlider() {
		if($('.slider').length) {
			$('.slider').slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: true,
				dots: true,
				fade: true,
				prevArrow: $('.slider-arrow-prev'),
				nextArrow: $('.slider-arrow-next')
			});
		}
		if($('.advantages-slider').length) {
			if ($(window).width() <= 420) {
				$('.advantages-slider').slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
					dots: true
				});
			} else {
				if ($('.advantages-slider').hasClass('slick-initialized')) {
					$('.advantages-slider').slick('unslick');
				}
			}
		}
		if($('.steps-wrap').length) {
			if ($(window).width() <= 420) {
				$('.steps-wrap').slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
					dots: true
				});
			} else {
				if ($('.steps-wrap').hasClass('slick-initialized')) {
					$('.steps-wrap').slick('unslick');
				}
			}
		}
	}

	onResize(event:any){
		if($('.advantages-slider').length) {
			if ($(window).width() <= 420) {
				if (!$('.advantages-slider').hasClass('slick-initialized')) {
					$('.advantages-slider').slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						arrows: false,
						dots: true
					});
				}
			} else {
				if ($('.advantages-slider').hasClass('slick-initialized')) {
					$('.advantages-slider').slick('unslick');
				}
			}
		}
		if($('.steps-wrap').length) {
			if ($(window).width() <= 420) {
				if (!$('.steps-wrap').hasClass('slick-initialized')) {
					$('.steps-wrap').slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						arrows: false,
						dots: true
					});
				}
			} else {
				if ($('.steps-wrap').hasClass('slick-initialized')) {
					$('.steps-wrap').slick('unslick');
				}
			}
		}
    }

    schedule(event) {
    	$(event.target).toggleClass('filters-option-active');
    	this.category = $(event.target).data('id');
    	this.httpService.getSchedule(this.category, $('.week-day-active').data('date')).subscribe((data:any) => {console.log(data);});
    }
                
}