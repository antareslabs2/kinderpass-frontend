import { Component } from '@angular/core';
// import { GlobalService } from './app.global.service';
// import { Api } from './api.service';
@Component({
	selector: 'my-app',
	template: '<headerTemplate></headerTemplate><router-outlet></router-outlet><footerTemplate></footerTemplate><app-dialog></app-dialog>',
	// providers: [GlobalService, Api]
})

export class AppComponent {
	constructor() {}
}