import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent }   from '../subscription.component';
import { TextMaskModule } from 'angular2-text-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: SubscriptionComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
	imports: [
		routing,
		CommonModule,
		TextMaskModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
        SubscriptionComponent
	]
})
export class SubscriptionModule {}