import { Component, Inject } from '@angular/core';
import { GlobalService } from './app.global.service';
import { Routes, Router, Event, RouterModule, NavigationEnd } from '@angular/router';
import {Ng2PageScrollModule, PageScrollInstance, PageScrollService, EasingLogic} from 'ng2-page-scroll';
import {DOCUMENT} from '@angular/platform-browser';

@Component({
	selector: 'headerTemplate',
	templateUrl: 'static/header.html'
})

export class HeaderComponent{ 

	openProfile:boolean;
	
	constructor(private gs: GlobalService, router:Router, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any){
		this.openProfile = false;
		let th = this;
		$(document).click(function (e){ 
			if (th.openProfile) {
				let profile = $(".user-menu"); 
				let button = $(".user"); 
				if (!profile.is(e.target) && profile.has(e.target).length === 0 && !button.is(e.target) && button.has(e.target).length === 0) { 
					th.openProfile = false;
				}
			}
			
		});

	}

	logout() : void {
		this.gs.logout();
		this.openProfile = false;
	}

	toogleLK() : void {
		this.openProfile = !this.openProfile;
	}

}