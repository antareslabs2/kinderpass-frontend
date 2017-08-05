import { NgModule, OnInit, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, Router, Event, RouterModule, NavigationEnd } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Ng2PageScrollModule, PageScrollInstance, PageScrollService, EasingLogic} from 'ng2-page-scroll';
import {DOCUMENT} from '@angular/platform-browser';

import { GlobalService }   from './app.global.service';
import { AppComponent }   from './app.component';
import { MainComponent }   from './main.component';
import { FooterComponent }   from './footer.component';
import { HeaderComponent }   from './header.component';

import { DialogComponent }   from './app.dialog';
//import { LocationComponent }   from './location.dialog';

import { Api }   from './api.service';

import {TruncatePipe} from './pipes';
import {KeysPipe} from './convertToArray';

import { HttpModule, RequestOptions, XHRBackend }   from '@angular/http';
import { HttpService } from './http.service';
import { LOCALE_ID } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';

import {MomentModule} from 'angular2-moment';
import * as moment from 'moment';
moment.locale('ru');

const appRoutes: Routes =[
    { path: '', component: MainComponent},
    { path: 'offer', loadChildren: 'app/lazy/offer.module#OfferModule' },
    { path: 'about', loadChildren: 'app/lazy/about.module#AboutModule' },
    { path: 'conditions', loadChildren: 'app/lazy/conditions.module#ConditionsModule' },
    { path: 'policy', loadChildren: 'app/lazy/policy.module#PolicyModule' },
    { path: 'registration', loadChildren: 'app/lazy/registration.module#RegistrationModule'},
    { path: 'event/:id', loadChildren: 'app/lazy/event.module#EventModule' },
    { path: 'contacts', loadChildren: 'app/lazy/contacts.module#ContactsModule' },
    { path: '**', redirectTo: '/'}
];

@NgModule({
    imports: [ BrowserModule, FormsModule, ReactiveFormsModule, HttpModule, BrowserAnimationsModule, RouterModule.forRoot(appRoutes), Ng2PageScrollModule.forRoot(), TextMaskModule, MomentModule ],
    declarations: [ 
        FooterComponent, 
        HeaderComponent, 
        AppComponent, 
        DialogComponent, 
        //LocationComponent,
        MainComponent, 
        TruncatePipe,
        KeysPipe
    ],
    bootstrap:    [ AppComponent ],
    providers: [
        {provide: Window, useValue: window},
        GlobalService,
        Api,
    	{ provide: LOCALE_ID, useValue: "ru-RU" },
    	{
    	    provide: HttpService,
    	    useFactory: (backend: XHRBackend, options: RequestOptions) => {
    	      return new HttpService(backend, options);
    	    },
    	    deps: [XHRBackend, RequestOptions]
    	},
   ]
})
export class AppModule {
    constructor(private gs: GlobalService, router:Router, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any) {
      router.events.subscribe((evt:Event) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          let pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({document: this.document, scrollTarget: '#'+tree.fragment, pageScrollDuration: 1000});
          let th = this;
          th.pageScrollService.start(pageScrollInstance);
          setTimeout(() => {
            th.pageScrollService.start(pageScrollInstance);
            }, 500);
        }
        if(window.location.pathname == '/')
            this.gs.innerpage = false;
        else {
            this.gs.innerpage = true;
            let pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({document: this.document, scrollTarget: this.document.body, pageScrollDuration: 300});
            this.pageScrollService.start(pageScrollInstance);
        }
    });
    }
 }