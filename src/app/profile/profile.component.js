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
var ProfileComponent = (function () {
    function ProfileComponent() {
        this.fullName = " ";
        this.address1 = " ";
        this.address2 = " ";
        this.city = " ";
        this.state = " ";
        this.country = " ";
        this.postalCode = 0;
        this.shareDataPub = true;
        this.shareDataPriv = true;
        this.about = " ";
        this.loggedIn = false;
    }
    ProfileComponent.prototype.ngAfterViewInit = function () {
        componentHandler.upgradeDom();
    };
    ProfileComponent.prototype.ngOnInit = function () {
        var me = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                me.userID = user.uid;
                me.fullName = user.displayName.length > 0 ? user.displayName : "";
                me.loggedIn = true;
                me.getAccount();
            }
            else {
                me.loggedIn = false;
            }
        });
    };
    ProfileComponent.prototype.getAccount = function () {
        var me = this;
        database.ref('account/' + this.userID).on('value', function (snapshot) {
            me.updateAccount(snapshot.val());
        });
    };
    ProfileComponent.prototype.updateAccount = function (account) {
        if (account) {
            this.fullName = account.fullName ? account.fullName : "";
            this.address1 = account.address1 ? account.address1 : "";
            this.address2 = account.address2 ? account.address2 : "";
            this.city = account.city ? account.city : "";
            this.state = account.state ? account.state : "";
            this.country = account.country ? account.country : "";
            this.postalCode = account.postalCode ? account.postalCode : null;
            this.shareDataPub = account.shareDataPub ? account.shareDataPub : true;
            this.shareDataPriv = account.shareDataPriv ? account.shareDataPriv : true;
            this.about = account.about ? account.about : "";
        }
    };
    ProfileComponent.prototype.saveAccount = function () {
        if (this.loggedIn) {
            database.ref("account/" + this.userID + "/").set({ "fullName": this.fullName, "address1": this.address1, "address2": this.address2,
                "city": this.city, "state": this.state, "country": this.country, "postalCode": this.postalCode,
                "shareDataPriv": this.shareDataPriv, "shareDataPub": this.shareDataPub });
        }
    };
    ProfileComponent = __decorate([
        core_1.Component({
            selector: 'my-profile',
            templateUrl: 'app/profile/profile.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map