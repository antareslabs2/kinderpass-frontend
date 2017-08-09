import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingComponent }   from '../booking.component';
import {MomentModule} from 'angular2-moment';

const routes: Routes = [
  { path: '', component: BookingComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
	imports: [
		routing,
		CommonModule,
		MomentModule
	],
	declarations: [
    	BookingComponent
	]
})
export class BookingModule {}