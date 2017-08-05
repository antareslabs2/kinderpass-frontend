import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactsComponent }   from '../contacts.component';

const routes: Routes = [
  { path: '', component: ContactsComponent },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

@NgModule({
	imports: [
		routing
	],
	declarations: [
        ContactsComponent, 
	]
})
export class ContactsModule {}