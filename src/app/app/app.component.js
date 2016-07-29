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
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var dashboard_component_1 = require('../dashboard/dashboard.component');
var hero_service_1 = require('../hero.service');
var settings_component_1 = require('../settings/settings.component');
var login_component_1 = require('../login/login.component');
var register_component_1 = require('../register/register.component');
var adddata_component_1 = require('../adddata/adddata.component');
var account_component_1 = require('../account/account.component');
var AppComponent = (function () {
    function AppComponent() {
        this.loggedIn = false;
        this.login = false;
        this.signUp = false;
    }
    AppComponent.prototype.ngAfterViewInit = function () {
        var me = this;
        componentHandler.upgradeDom();
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                me.loggedIn = true;
                console.log(user);
                me.userID = user.uid;
                me.displayName = user.displayName;
                me.getAccount();
            }
            else {
                me.loggedIn = false;
            }
        });
    };
    AppComponent.prototype.signOut = function () {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            //alert("successfuly signed out");
        }, function (error) {
            // An error happened.
        });
    };
    AppComponent.prototype.getAccount = function () {
        var me = this;
        database.ref('account/' + this.userID).on('value', function (snapshot) {
            me.updateAccount(snapshot.val());
        });
    };
    AppComponent.prototype.updateAccount = function (account) {
        if (account) {
            this.displayName = account.fullName ? account.fullName : "";
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app/app/app.component.html',
            styleUrls: ['app/app/app.component.css'],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, login_component_1.LoginComponent, register_component_1.RegisterComponent],
            providers: [
                router_deprecated_1.ROUTER_PROVIDERS,
                hero_service_1.HeroService,
            ]
        }),
        router_deprecated_1.RouteConfig([
            { path: '/dashboard', name: 'Dashboard', component: dashboard_component_1.DashboardComponent, useAsDefault: true },
            { path: '/settings', name: 'Settings', component: settings_component_1.SettingsComponent },
            //{ path: '/datavisualization',     name: 'DataVisualization',     component: DataVisualizationComponent },
            { path: '/login', name: 'Login', component: login_component_1.LoginComponent },
            { path: '/signup', name: 'Register', component: register_component_1.RegisterComponent },
            { path: '/adddata', name: 'AddData', component: adddata_component_1.AddDataComponent },
            { path: '/account', name: 'Account', component: account_component_1.AccountComponent }
        ]), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map