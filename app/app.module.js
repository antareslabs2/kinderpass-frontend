"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var animations_1 = require("@angular/platform-browser/animations");
var ng2_page_scroll_1 = require("ng2-page-scroll");
var platform_browser_2 = require("@angular/platform-browser");
var app_global_service_1 = require("./app.global.service");
var app_component_1 = require("./app.component");
var main_component_1 = require("./main.component");
var footer_component_1 = require("./footer.component");
var header_component_1 = require("./header.component");
var registration_component_1 = require("./registration.component");
var event_component_1 = require("./event.component");
var app_dialog_1 = require("./app.dialog");
var location_dialog_1 = require("./location.dialog");
var api_service_1 = require("./api.service");
var pipes_1 = require("./pipes");
var convertToArray_1 = require("./convertToArray");
var http_1 = require("@angular/http");
var http_service_1 = require("./http.service");
var core_2 = require("@angular/core");
var angular2_text_mask_1 = require("angular2-text-mask");
var angular2_moment_1 = require("angular2-moment");
var moment = require("moment");
moment.locale('ru');
var appRoutes = [
    { path: '', component: main_component_1.MainComponent },
    { path: 'offer', loadChildren: 'app/lazy/offer.module#OfferModule' },
    { path: 'about', loadChildren: 'app/lazy/about.module#AboutModule' },
    { path: 'conditions', loadChildren: 'app/lazy/conditions.module#ConditionsModule' },
    { path: 'policy', loadChildren: 'app/lazy/policy.module#PolicyModule' },
    { path: 'registration', component: registration_component_1.RegistrationComponent },
    { path: 'event/:id', component: event_component_1.EventComponent },
    { path: '**', redirectTo: '/' }
];
var AppModule = (function () {
    function AppModule(gs, router, pageScrollService, document) {
        var _this = this;
        this.gs = gs;
        this.pageScrollService = pageScrollService;
        this.document = document;
        router.events.subscribe(function (evt) {
            if (!(evt instanceof router_1.NavigationEnd)) {
                return;
            }
            var tree = router.parseUrl(router.url);
            if (tree.fragment) {
                var pageScrollInstance_1 = ng2_page_scroll_1.PageScrollInstance.newInstance({ document: _this.document, scrollTarget: '#' + tree.fragment, pageScrollDuration: 1000 });
                var th_1 = _this;
                th_1.pageScrollService.start(pageScrollInstance_1);
                setTimeout(function () {
                    th_1.pageScrollService.start(pageScrollInstance_1);
                }, 500);
            }
            if (window.location.pathname == '/')
                _this.gs.innerpage = false;
            else {
                _this.gs.innerpage = true;
                var pageScrollInstance = ng2_page_scroll_1.PageScrollInstance.newInstance({ document: _this.document, scrollTarget: _this.document.body, pageScrollDuration: 300 });
                _this.pageScrollService.start(pageScrollInstance);
            }
        });
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, http_1.HttpModule, animations_1.BrowserAnimationsModule, router_1.RouterModule.forRoot(appRoutes), ng2_page_scroll_1.Ng2PageScrollModule.forRoot(), angular2_text_mask_1.TextMaskModule, angular2_moment_1.MomentModule],
        declarations: [
            footer_component_1.FooterComponent,
            header_component_1.HeaderComponent,
            app_component_1.AppComponent,
            app_dialog_1.DialogComponent,
            location_dialog_1.LocationComponent,
            main_component_1.MainComponent,
            registration_component_1.RegistrationComponent,
            event_component_1.EventComponent,
            pipes_1.TruncatePipe,
            convertToArray_1.KeysPipe
        ],
        bootstrap: [app_component_1.AppComponent],
        providers: [
            { provide: Window, useValue: window },
            app_global_service_1.GlobalService,
            api_service_1.Api,
            { provide: core_2.LOCALE_ID, useValue: "ru-RU" },
            {
                provide: http_service_1.HttpService,
                useFactory: function (backend, options) {
                    return new http_service_1.HttpService(backend, options);
                },
                deps: [http_1.XHRBackend, http_1.RequestOptions]
            },
        ]
    }),
    __param(3, core_1.Inject(platform_browser_2.DOCUMENT)),
    __metadata("design:paramtypes", [app_global_service_1.GlobalService, router_1.Router, ng2_page_scroll_1.PageScrollService, Object])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map