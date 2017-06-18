import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferComponent }   from '../offer.component';

const routes: Routes = [
  { path: '', component: OfferComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
	imports: [
		routing
	],
	declarations: [
		OfferComponent
	]
})
export class OfferModule {}