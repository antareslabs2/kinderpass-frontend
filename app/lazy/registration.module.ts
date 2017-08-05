import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationComponent }   from '../registration.component';
import { TextMaskModule } from 'angular2-text-mask';

const routes: Routes = [
  { path: '', component: RegistrationComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
	imports: [
		routing,
		TextMaskModule
	],
	declarations: [
    	RegistrationComponent
	]
})
export class RegistrationModule {}