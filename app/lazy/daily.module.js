"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var daily_component_1 = require("../daily.component");
var angular2_moment_1 = require("angular2-moment");
var routes = [
    { path: '', component: daily_component_1.DailyComponent },
];
exports.routing = router_1.RouterModule.forChild(routes);
var DailyModule = (function () {
    function DailyModule() {
    }
    return DailyModule;
}());
DailyModule = __decorate([
    core_1.NgModule({
        imports: [
            exports.routing,
            common_1.CommonModule,
            angular2_moment_1.MomentModule
        ],
        declarations: [
            daily_component_1.DailyComponent
        ]
    })
], DailyModule);
exports.DailyModule = DailyModule;
//# sourceMappingURL=daily.module.js.map