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
var AccountComponent = (function () {
    function AccountComponent() {
        this.fullName = " ";
        this.address1 = " ";
        this.address2 = " ";
        this.city = " ";
        this.state = " ";
        this.country = " ";
        this.postalCode = 0;
        this.shareDataPub = true;
        this.shareDataPriv = true;
        this.loggedIn = false;
    }
    AccountComponent.prototype.ngAfterViewInit = function () {
        componentHandler.upgradeDom();
    };
    AccountComponent.prototype.ngOnInit = function () {
        var me = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                me.userID = user.uid;
                me.fullName = user.displayName ? user.displayName : "";
                me.loggedIn = true;
                me.getAccount();
            }
            else {
                me.loggedIn = false;
            }
        });
    };
    AccountComponent.prototype.getAccount = function () {
        var me = this;
        database.ref('account/' + this.userID).on('value', function (snapshot) {
            me.updateAccount(snapshot.val());
        });
    };
    AccountComponent.prototype.updateAccount = function (account) {
        if (account) {
            this.fullName = account.fullName ? account.fullName : "";
            this.address1 = account.address1 ? account.address1 : "";
            this.address2 = account.address2 ? account.address2 : "";
            this.city = account.city ? account.city : "";
            this.state = account.state ? account.state : "";
            this.country = account.country ? account.country : "";
            this.postalCode = account.postalCode ? account.postalCode : null;
            this.shareDataPriv = account.shareDataPriv ? account.shareDataPriv : true;
        }
    };
    AccountComponent.prototype.saveAccount = function () {
        if (this.loggedIn) {
            database.ref("account/" + this.userID + "/").set({ "fullName": this.fullName, "address1": this.address1, "address2": this.address2,
                "city": this.city, "state": this.state, "country": this.country, "postalCode": this.postalCode,
                "shareDataPriv": this.shareDataPriv });
        }
    };
    AccountComponent = __decorate([
        core_1.Component({
            selector: 'my-account',
            templateUrl: 'app/account/account.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], AccountComponent);
    return AccountComponent;
}());
exports.AccountComponent = AccountComponent;
//# sourceMappingURL=account.component.js.map