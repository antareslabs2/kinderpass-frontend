import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventComponent }   from '../event.component';
import {MomentModule} from 'angular2-moment';

const routes: Routes = [
  { path: '', component: EventComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
	imports: [
		routing,
		CommonModule,
		MomentModule
	],
	declarations: [
    	EventComponent
	]
})
export class EventModule {}