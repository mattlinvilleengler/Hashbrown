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
var settingsObj_1 = require('../settingsObj');
var SettingsComponent = (function () {
    function SettingsComponent() {
        this.finance = false;
        this.happiness = false;
        this.exercise = false;
        this.nutrition = false;
        this.sleep = false;
        this.alcohol = false;
        this.loggedIn = false;
    }
    // settings: Settings = new Settings();
    //settings: Settings = this.getSettingsX();
    SettingsComponent.prototype.ngAfterViewInit = function () {
        componentHandler.upgradeDom();
    };
    SettingsComponent.prototype.ngOnInit = function () {
        var me = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                me.loggedIn = true;
                me.userID = user.uid;
                me.getSettings();
            }
            else {
                me.loggedIn = false;
            }
        });
    };
    SettingsComponent.prototype.getSettingsX = function () {
        var me = this;
        var setty;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                me.userID = user.uid;
                database.ref('settings/' + me.userID).on('value', function (snapshot) {
                    return setty = snapshot.val();
                });
            }
            else {
                return new settingsObj_1.Settings();
            }
        });
    };
    SettingsComponent.prototype.getSettings = function () {
        var me = this;
        database.ref('settings/' + this.userID).on('value', function (snapshot) {
            me.updateSettings(snapshot.val());
        });
    };
    SettingsComponent.prototype.updateSettings = function (settings) {
        if (settings) {
            this.finance = settings.finance;
            this.happiness = settings.happiness;
            this.exercise = settings.exercise;
            this.nutrition = settings.nutrition;
            this.sleep = settings.sleep;
            this.alcohol = settings.alcohol;
        }
    };
    SettingsComponent.prototype.saveSettings = function () {
        if (this.loggedIn) {
            database.ref("settings/" + this.userID + "/").set({ "finance": this.finance, "happiness": this.happiness,
                "exercise": this.exercise, "nutrition": this.nutrition, "sleep": this.sleep, "alcohol": this.alcohol
            });
        }
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'my-settings',
            templateUrl: 'app/settings/settings.component.html',
            styleUrls: ['app/settings/settings.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=settings.component.js.map