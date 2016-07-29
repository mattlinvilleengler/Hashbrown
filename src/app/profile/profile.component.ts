import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var componentHandler: any;
declare var database: any;
declare var firebase: any;

@Component({
  moduleId: module.id,
  selector: 'my-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements AfterViewInit, OnInit {
  fullName: string = " ";
  address1: string = " ";
  address2: string = " ";
  city: string = " ";
  state: string = " ";
  country: string = " ";
  postalCode: number = 0;
  shareDataPub: boolean = true;
  shareDataPriv: boolean = true;
  about: string = " ";


  loggedIn: boolean = false;
  userID: number;
  

  ngAfterViewInit():any {
    componentHandler.upgradeDom();
  }
  ngOnInit():any{
    var me = this;
    firebase.auth().onAuthStateChanged(function(user:any) {
    if (user) {
      me.userID = user.uid;
      me.fullName = user.displayName.length > 0 ? user.displayName : "" ;
      me.loggedIn = true;
      me.getAccount();
    } else {
      me.loggedIn = false;
    }
    });
  }

  getAccount(){
  var me = this;
  database.ref('account/' + this.userID ).on('value', function(snapshot:any) {
  me.updateAccount(snapshot.val());
  });
  }
  updateAccount(account:any){
    if(account){
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
  }
  saveAccount(){
    if(this.loggedIn){
    database.ref("account/" + this.userID + "/").set(
      {"fullName": this.fullName, "address1": this.address1, "address2": this.address2,
      "city": this.city, "state": this.state, "country": this.country, "postalCode": this.postalCode,
       "shareDataPriv": this.shareDataPriv, "shareDataPub": this.shareDataPub  } 
    );
    }
  }
}
