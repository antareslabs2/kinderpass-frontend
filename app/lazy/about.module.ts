import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent }   from '../about.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
	imports: [
		routing
	],
	declarations: [
        AboutComponent, 
	]
})
export class AboutModule {}