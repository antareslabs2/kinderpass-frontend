import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AppComponent }   from './app.component';

import { HttpModule }   from '@angular/http';
import { LOCALE_ID } from '@angular/core';

@NgModule({
    imports:      [ BrowserModule, FormsModule, HttpModule ],
    declarations: [ AppComponent ],
    bootstrap:    [ AppComponent ],
    providers: [
    	{ provide: LOCALE_ID, useValue: "ru-RU" }
   ]
})
export class AppModule { }