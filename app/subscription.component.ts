import { Component, OnInit } from '@angular/core';
import { GlobalService } from './app.global.service';
import { Location } from '@angular/common'
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Api } from './api.service';

@Component({
	selector: 'subscribtion',
	templateUrl: `../static/subscription.html?v=${new Date().getTime()}`,
})

export class SubscriptionComponent implements OnInit { 
	
	subscriptions: any;
	subscription: any;
	innerpage:boolean;
	subscriptionForm: FormGroup;
	submitted: boolean;
 
	constructor(private httpService: Api, private fb: FormBuilder, private route: ActivatedRoute, private gs: GlobalService){
		this.gs.innerpage = true;
		this.innerpage = true;
		this.submitted = false;
		this.subscriptions = {
			once_a_week: {
				name: 'Раз в неделю',
				events: 'Восемь',
				days: 'Один раз в неделю',
				price: 4990
			},
			weekends: {
				name: 'Только выходные',
				events: 'Двенадцать',
				days: 'Каждые выходные',
				price: 7900
			},
			week: {
				name: 'Выходные и будние',
				events: 'Восемнадцать',
				days: 'В будние и выходные',
				price: 9990
			}
		};
	}

	ngOnInit(){
		this.subscriptionForm = this.fb.group({
			'cardNumber': ['', Validators.compose([Validators.required, Validators.pattern("^\\d+$")])],
			'cardOwner': ['', Validators.compose([Validators.required])],
			'cardMonth': ['', Validators.compose([Validators.required, Validators.pattern("^\\d+$")])],
			'cardYear': ['', Validators.compose([Validators.required, Validators.pattern("^\\d+$")])],
			'name': ['', Validators.compose([Validators.required])],
			'email': ['', Validators.compose([Validators.required])],
			'phone': ['', Validators.compose([Validators.required])],
		})

		this.route.params.subscribe(params => {
			this.subscription = this.subscriptions[params['type']];
		});
	}

	submit(form:any) {
		this.submitted = true;
		if(form.valid) {			
			let body = {
				cardNumber: form.controls.cardNumber.value, 
				cardOwner: form.controls.cardOwner.value, 
				cardMonth: form.controls.cardMonth.value, 
				cardYear: form.controls.cardYear.value, 
				name: form.controls.name.value, 
				email: form.controls.email.value, 
				phone: form.controls.phone.value
			};
			this.httpService.sendUserInfo(JSON.stringify(body)).subscribe((data:any) => {
				this.gs.popupName = "msg";
				this.gs.msg = "Спасибо за заявку. Наш менеджер свяжется с Вами в ближайшее время";
				// что-то после отправки
			});
		}
	}


}	