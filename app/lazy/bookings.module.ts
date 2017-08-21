import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingsComponent }   from '../bookings.component';
import {MomentModule} from 'angular2-moment';

const routes: Routes = [
  { path: '', component: BookingsComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
	imports: [
		routing,
		CommonModule,
		MomentModule
	],
	declarations: [
    	BookingsComponent
	]
})
export class BookingsModule {}