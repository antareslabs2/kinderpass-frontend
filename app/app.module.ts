import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent }   from './app.component';
import { DialogComponent }   from './app.dialog';

import { HttpModule }   from '@angular/http';
import { LOCALE_ID } from '@angular/core';

@NgModule({
    imports:      [ BrowserModule, FormsModule, ReactiveFormsModule, HttpModule, BrowserAnimationsModule ],
    declarations: [ AppComponent, DialogComponent ],
    bootstrap:    [ AppComponent ],
    providers: [
    	{ provide: LOCALE_ID, useValue: "ru-RU" }
   ]
})
export class AppModule { }