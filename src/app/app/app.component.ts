import { Component, Inject, ElementRef, OnInit, Injectable, AfterViewInit, ViewChild } from '@angular/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { DashboardComponent }  from '../dashboard/dashboard.component' ;
import { SettingsComponent }     from '../settings/settings.component';
import { DataVisualizationComponent }     from '../datavisualization/datavisualization.component';
import { LoginComponent }     from '../login/login.component';
import { RegisterComponent }     from '../register/register.component';
import { AddDataComponent }     from '../adddata/adddata.component';
import { AccountComponent }     from '../account/account.component';
import { ProfileComponent }     from '../profile/profile.component';
import { LandingComponent }     from '../landing/landing.component';


declare var database: any;
declare var componentHandler: any;
declare var firebase: any;
declare var dialogPolyfill: any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, LandingComponent],
  providers: [
    ROUTER_PROVIDERS
  ]
})
@RouteConfig([
  { path: '/dashboard', name: 'Dashboard', component: DashboardComponent, useAsDefault: true },
  { path: '/settings', name: 'Settings', component: SettingsComponent },
  //{ path: '/datavisualization',     name: 'DataVisualization',     component: DataVisualizationComponent },
  { path: '/login', name: 'Login', component: LoginComponent },
  { path: '/signup', name: 'Register', component: RegisterComponent },
  { path: '/adddata', name: 'AddData', component: AddDataComponent },
  { path: '/account', name: 'Account', component: AccountComponent }
  //{ path: '/profile',     name: 'Profile',     component: ProfileComponent }


])
export class AppComponent implements AfterViewInit {
  loggedIn: boolean = false;
  login: boolean = false;
  signUp: boolean = false;
  displayName: string;
  userID: number;
  loginMethod: string = "current";
  newUser: boolean = false;
  loggingIn: boolean = false;
  router: any = Router;
  errorsOpen: boolean = true;
  url: string = "";
  feedbackSuccess: boolean = false;
  feedbackName: string = "";
  feedbackEmail: string = "";
  feedbackMessage: string = "";
  

  @ViewChild('refresh') refresh: any;
  @ViewChild('successDialog') successDialog: any;
  @ViewChild('account') account: any;
  @ViewChild('dashboard') dashboard: any;
  @ViewChild('hiddenLink') hiddenLink: any;
  @ViewChild('submitErrorDialog') submitErrorDialog: any;
 

  successMessage: string = " ";

  ngAfterViewInit(): any {
    var me = this;
    this.url = window.location.href;
    componentHandler.upgradeDom();
    this.errorsOpen = window.localStorage.getItem('errorsOpen') == "true" ? true : false;
    dialogPolyfill.registerDialog(this.successDialog.nativeElement);  
    dialogPolyfill.registerDialog(this.submitErrorDialog.nativeElement);  
    firebase.auth().onAuthStateChanged(function (user: any) {
      if (user) {
        me.loginMethod = window.localStorage.getItem('loginMethod');
        me.loggingIn = window.localStorage.getItem('loggingIn') == "true" ? true : false;
        me.newUser = me.loginMethod == "new" ? true : false;
        me.successMessage = me.loginMethod == "new" ? "Account Successfully Created. " :
          "Successfully signed in as " + user.displayName;
        me.successMessage += me.loginMethod == "new" ? "Now let's get started." : "";
        me.loggingIn ? me.successDialog.nativeElement.showModal() : me.loggedIn = true;
        me.userID = user.uid;
        me.displayName = user.displayName;
        me.getAccount();
      } else {
        me.loggedIn = false;
      }
    });
    this.refresh.nativeElement.onmouseover= function(){};
      setInterval(function () { me.refreshPage() }, 200)
  }
  signOut() {
    this.hiddenLink.nativeElement.click();
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      //alert("successfuly signed out");
    }, function (error: any) {
      // An error happened.
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
      this.displayName = account.fullName ? account.fullName : "";
    }
  }
  refreshPage() {
    this.refresh.nativeElement.onmouseover();
  }
  closeSuccess() {
    window.localStorage.setItem('loginMethod', "current");
    window.localStorage.setItem('loggingIn', "false");
    this.successDialog.nativeElement.close();
    this.loggedIn = true;
  }
  closeSuccessNewUser() {
    window.localStorage.setItem('loginMethod', "current");
    window.localStorage.setItem('loggingIn', "false");
    this.successDialog.nativeElement.close();
    //this.account.nativeElement.click();
    window.localStorage.setItem('newAccount', "true");
    window.location.pathname = "my-app/account";
    this.loggedIn = true;
  }
  openSubmit(){
    this.submitErrorDialog.nativeElement.showModal();
  }
  closeSubmitDialog(){
    this.submitErrorDialog.nativeElement.close();
  }
  dismiss(){
    window.localStorage.setItem('errorsOpen', 'false');
  }
  addFeedback(){
    var me = this;
     database.ref("feedback/").push({
       "name": this.feedbackName, "email": this.feedbackEmail, "message": this.feedbackMessage
      });
     this.feedbackSuccess = true;
     setTimeout(function(){ me.closeSubmitDialog(); me.feedbackSuccess = false;  },2250);
     this.feedbackName = "";
     this.feedbackEmail = "";
     this.feedbackMessage = "";
  }
}
