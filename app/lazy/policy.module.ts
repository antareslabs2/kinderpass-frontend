import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PolicyComponent }   from '../policy.component';


const routes: Routes = [
  { path: '', component: PolicyComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
	imports: [
		routing
	],
	declarations: [
    PolicyComponent,

	]
})
export class PolicyModule {}