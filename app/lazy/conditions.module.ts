import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConditionsComponent }   from '../conditions.component';


const routes: Routes = [
  { path: '', component: ConditionsComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
	imports: [
		routing
	],
	declarations: [
    ConditionsComponent, 
	]
})
export class ConditionsModule {}