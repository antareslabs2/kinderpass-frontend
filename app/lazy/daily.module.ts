import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DailyComponent }   from '../daily.component';
import {MomentModule} from 'angular2-moment';

const routes: Routes = [
  { path: '', component: DailyComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
	imports: [
		routing,
		CommonModule,
		MomentModule
	],
	declarations: [
        DailyComponent
	]
})
export class DailyModule {}