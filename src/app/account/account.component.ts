import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
declare var componentHandler: any;
declare var database: any;
declare var firebase: any;
declare var dialogPolyfill: any;

@Component({
  moduleId: module.id,
  selector: 'my-account',
  templateUrl: 'account.component.html'
})
export class AccountComponent implements AfterViewInit, OnInit {
  fullName: string = "";
  address1: string = "";
  address2: string = "";
  city: string = "";
  state: string = "";
  country: string = "";
  postalCode: number;
  shareDataPub: boolean = true;
  shareDataPriv: boolean = true;

  loggedIn: boolean = false;
  userID: number;
  newUser: boolean = false;

  @ViewChild('newDialog') newDialog: any;
  @ViewChild('successDialog') successDialog: any;

  ngAfterViewInit(): any {
    componentHandler.upgradeDom();
    dialogPolyfill.registerDialog(this.newDialog.nativeElement);
    dialogPolyfill.registerDialog(this.successDialog.nativeElement);    
  }
  ngOnInit(): any {
    var me = this;
    this.newUser = window.localStorage.getItem('newAccount') == "true" ? true : false;
    firebase.auth().onAuthStateChanged(function (user: any) {
      if (user) {
        me.userID = user.uid;
        me.fullName = user.displayName ? user.displayName : "";
        me.loggedIn = true;
        me.newUser ? me.openDialog(me.newDialog) : me.getAccount();
      } else {
        me.loggedIn = false;
      }
    });
  }

  getAccount() {
    var me = this;
    database.ref('account/' + this.userID).on('value', function (snapshot: any) {
      me.updateAccount(snapshot.val());
    });
  }
  updateAccount(account: any) {
    if (account) {
      this.fullName = account.fullName ? account.fullName : "";
      this.address1 = account.address1 ? account.address1 : "";
      this.address2 = account.address2 ? account.address2 : "";
      this.city = account.city ? account.city : "";
      this.state = account.state ? account.state : "";
      this.country = account.country ? account.country : "";
      this.postalCode = account.postalCode ? account.postalCode : "";
      this.shareDataPriv = account.shareDataPriv ? account.shareDataPriv : true;
    }
    setTimeout(function(){componentHandler.upgradeDom();}, 500)
  }
  saveAccount() {
    if (this.loggedIn) {
      database.ref("account/" + this.userID + "/").set(
        {
          "fullName": this.fullName, "address1": this.address1, "address2": this.address2,
          "city": this.city, "state": this.state, "country": this.country, "postalCode": this.postalCode,
          "shareDataPriv": this.shareDataPriv
        }
      );
      this.successDialog.nativeElement.showModal()
    }
  }
  closeNewDialog() {
    this.newDialog.nativeElement.close();
    window.localStorage.setItem('newAccount', "false");
    window.localStorage.setItem('newSettings', "true");
    window.location.pathname = "my-app/settings";
  }
  closeSuccessDialog() {
    this.successDialog.nativeElement.close();
  }
  dashboardSuccess() {
    this.successDialog.nativeElement.close();
    window.location.pathname = "my-app/dashboard";
  }
  openDialog(d) {
    setTimeout(function () { d.nativeElement.showModal(); }, 1500);
  }
}
