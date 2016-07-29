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
var AddDataComponent = (function () {
    function AddDataComponent() {
        this.finance = 0;
        this.happiness = 0;
        this.exercise = 0;
        this.nutrition = 0;
        this.sleep = 0;
        this.alcohol = 0;
        this.loggedIn = false;
        this.financeSet = false;
        this.happinessSet = false;
        this.exerciseSet = false;
        this.nutritionSet = false;
        this.sleepSet = false;
        this.alcoholSet = false;
    }
    AddDataComponent.prototype.ngAfterViewInit = function () {
        componentHandler.upgradeDom();
    };
    AddDataComponent.prototype.ngOnInit = function () {
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
    AddDataComponent.prototype.getSettings = function () {
        var me = this;
        database.ref('settings/' + this.userID).on('value', function (snapshot) {
            me.updateSettings(snapshot.val());
        });
    };
    AddDataComponent.prototype.updateSettings = function (settings) {
        this.financeSet = settings.finance;
        this.happinessSet = settings.happiness;
        this.exerciseSet = settings.exercise;
        this.nutritionSet = settings.nutrition;
        this.sleepSet = settings.sleep;
        this.alcoholSet = settings.alcohol;
    };
    AddDataComponent.prototype.saveData = function () {
        if (this.loggedIn) {
            var d = new Date();
            var date = d.getTime();
            database.ref("data/" + this.userID + "/").push({ "time": date, "finance": this.finance, "happiness": this.happiness,
                "exercise": this.exercise, "nutrition": this.nutrition, "sleep": this.sleep, "alcohol": this.alcohol });
        }
    };
    AddDataComponent = __decorate([
        core_1.Component({
            selector: 'my-adddata',
            templateUrl: 'app/adddata/adddata.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], AddDataComponent);
    return AddDataComponent;
}());
exports.AddDataComponent = AddDataComponent;
//# sourceMappingURL=adddata.component.js.map