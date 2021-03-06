import { Component } from '@angular/core';
import { Api } from './api.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { GlobalService } from './app.global.service';

@Component({
	selector: 'registration',
	templateUrl: `../static/registration.html?v=${new Date().getTime()}`,
	providers: [Api],
	styles: [`
		input.ng-touched.ng-invalid {border:solid red 2px;}
		input.ng-touched.ng-valid {border:solid green 2px;}
	`]
})

export class RegistrationComponent{ 
  
	opf:string;
	openPopup:string;
	msg:string;
	innerpage:boolean;

	o_id: any;
	o_tid: any;
	o_kpp: any;
	ie_id: any;
	ie_tid: any;
	bank_cacc: any;
	phone: any;

	constructor(private httpService: Api, private gs:GlobalService){
		this.opf = 'ООО';
		this.openPopup = '';
		this.msg = '';
		this.innerpage = true;
		this.o_id = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
		this.o_tid = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
		this.o_kpp = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
		this.ie_id = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
		this.ie_tid = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
		this.bank_cacc = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
		this.phone = ['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
	}

	submit(event:any):any{
		let invalidFields = this.validateForm(event.target.parentElement);
		if (invalidFields.length == 0) {
			let data = $(event.target.parentElement).serialize();
			var url = "https://script.google.com/macros/s/AKfycbzLz5xJS2x726J14D04DOYNyuuhIRrAqXlRlaJTf7sYSgoQcfE/exec";
			$.ajax({
				url:  url,
				type: 'POST',
				data: data,
				success: function(resp) {
					$.ajax({
						url:  './offer-application/offer-gen.php',
						type: 'POST',
						data: data,
						success: function(resp) {
							var w = window.open('about:blank', '_blank');
							    w.document.write(resp);
							    w.document.close();
							
						},
						error: function(resp) {
							console.log(resp)
						},
					});
				},
				error: function() {
				},
			});

		} else {
			this.gs.popupName = 'msgCancel';
			if (invalidFields.length == 1) {
				this.gs.msg = 'Вы неправильно заполнили поле ' + invalidFields[0] + '. Пожалуйста, исправьте ошибку и отправьте заявку еше раз.';
			}
			else {
				this.gs.msg = 'Вы неправильно заполнили поля ' + invalidFields.join(', ') + '. Пожалуйста, исправьте ошибки и отправьте заявку еше раз.';	
			}
		}
	}

	validateForm(form:any):any {
		var result = [];				
		if ($('input[name=opf]:checked').val() == "ООО") {
			for (let d in $('#llc').children()) {
				var c2 = $('#llc').children()[d];
				
				if (c2.name == 'o_id') {
					if (c2.value.indexOf('_') > -1 || c2.value.length < 13) {
						result.push('ОГРН');
					}
					continue;
				}							
				
				if (c2.name == 'o_tid') {
					if (c2.value.indexOf('_') > -1 || c2.value.length < 10) {
						result.push('ИНН');
					}
					continue;
				}							
				
				if (c2.name == 'o_kpp') {
					if (c2.value.indexOf('_') > -1 || c2.value.length < 9) {
						result.push('КПП');
					}
					continue;
				}							
							
				
				if (c2.type == "text"){
					if (c2.value.length < 5) {
						result.push(c2.placeholder);
					}
					continue;
				}
				
			}						
		} else if ($('input[name=opf]:checked').val() == "ИП") {
			for (let d in $('#ie').children()) {
				var c2 = $('#ie').children()[d];

				if (c2.name == 'ie_id') {
					if (c2.value.indexOf('_') > -1 || c2.value.length < 15) {
						result.push('ОГРНИП');
					}
					continue;
				}	
				
				if (c2.name == 'ie_tid') {
					if (c2.value.indexOf('_') > -1 || c2.value.length < 12) {
						result.push('ИНН');
					}
					continue;
				}						

				
				if (c2.type == "text"){
					if (c2.value.length < 5) {
						result.push(c2.placeholder);
					}
					continue;
				}
				
			}						
		}

		
		for (let c in $(form).children()) {
			var child = $(form).children()[c];

			if (child.name == 'bank_pacc') {
				if (child.value.indexOf('_') > -1 || child.value.length < 20) {
					result.push('Расчетный счет');
				}
				continue;
			}
			
			if (child.name == 'bank_cacc') {
				if (child.value.indexOf('_') > -1 || child.value.length < 20) {
					result.push('Корр. счет');
				}
				continue;
			}
			
			if (child.name == 'bank_id') {
				if (child.value.indexOf('_') > -1 || child.value.length < 9) {
					result.push('БИК');
				}
				continue;
			}
								
			if (child.name == 'phone') {
				if (child.value.indexOf('_') > -1 || child.value.length < 1) {
					result.push('Телефон');
				}
				continue;
			}
			if (child.name == 'email') {
				if (child.value.length < 5 || child.value.indexOf('@') < 0 || child.value.indexOf('.') < 0) {
					result.push('e-mail');
				}
				continue;
			}


			// all other lengths
			if (child.type == "text"){
				if (child.value.length < 3) {
					result.push(child.placeholder);
				}
				continue;
			}
			
		}
		return result;

	}
}