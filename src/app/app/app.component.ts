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


     category: string = "Select Category";
     task: string = "";
     description: string = "";
     name: string= "";
     taskOn: boolean = false;

     categoryShow: string = "Select Category";
     taskShow: string = "";
     descriptionShow: string = "";
     nameShow: string= "";
     dateShow: any;
     timeSince: any;
     status:number = 0;
     groupStat: any[] = [];
     

  @ViewChild('addDialog') addDialog: any;
  @ViewChild('refresh') refresh: any;
  @ViewChild('welcomeDialog') welcomeDialog: any;
  @ViewChild('statusDialog') statusDialog: any;

  successMessage: string = " ";

  ngAfterViewInit(): any {
    var me = this;
    this.url = window.location.href;
    componentHandler.upgradeDom();
        dialogPolyfill.registerDialog(this.addDialog.nativeElement);
        dialogPolyfill.registerDialog(this.welcomeDialog.nativeElement);
        dialogPolyfill.registerDialog(this.statusDialog.nativeElement);
        
    this.errorsOpen = window.localStorage.getItem('errorsOpen') == "true" ? true : false;
    firebase.auth().onAuthStateChanged(function (user: any) {
      if (user) {
        me.loginMethod = window.localStorage.getItem('loginMethod');
        me.loggingIn = window.localStorage.getItem('loggingIn') == "true" ? true : false;
        me.newUser = me.loginMethod == "new" ? true : false;
        me.loginMethod == "new" ? me.welcomeDialog.nativeElement.showModal()  : false;
        me.userID = user.uid;
        me.name = user.displayName ? user.displayName : "";
        me.loggedIn = true;
        me.getGroup();
        me.getName();
      } else {
        me.loggedIn = false;
      }
    });
    this.refresh.nativeElement.onmouseover= function(){};
      setInterval(function () { me.refreshPage() }, 200)
  }
  signOut() {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      //alert("successfuly signed out");
    }, function (error: any) {
      // An error happened.
    });

  }
    getName() {
    var me = this;
    database.ref("names/" + this.userID + "/").on('value', function (snapshot: any) {
      me.updateName(snapshot.val());
    });
      database.ref("currentTask/" + this.userID + "/status").on('value', function (snapshot: any) {
      me.updateStatus(snapshot.val());
    });
  }
   updateStatus(status: any) {
    if (status) {
      this.status = status.status;
    }
  }
    updateName(name: any) {
    if (name) {
      this.name = name.name;
    }
  }
  getGroup() {
    var me = this;
    database.ref('currentTask/').on('value', function (snapshot: any) {
      me.updateGroup(snapshot.val());
    });
  }
  updateGroup(groups: any) {
    if (groups) {
      this.groupStat =[];
      for (var group in groups){
        var g: any = {};
      g.taskOn = groups[group].taskOn == "true" ? true : false;
      g.categoryShow = groups[group].category;
      g.taskShow = groups[group].task;
      g.descriptionShow = groups[group].description;
      g.dateShow = new Date(groups[group].date).toLocaleDateString() + " " + new Date(groups[group].date).toLocaleTimeString() ;
      g.timeSince = this.getTimeSince(groups[group].date); 
      g.nameShow = groups[group].name;
      g.status = groups[group].status.status;
      this.groupStat.push(g);
    }
       
    } else {
      this.taskOn = false;
    }
  }
  getTimeSince(d){
     var time: number =  ((( new Date().getTime()) - d ) /  3600000);
     var t = time.toString().split(".");
     var hrs = +t[0] > 0 ? t[0] + "hrs" : "";
     var afterD = +t[1] > 0 ? t[1].split("") : 0;
     var min = ((+(afterD[0] + afterD[1]) / 100) * 60) + "min";
     return hrs + " " + min;
  }
  refreshPage() {
    this.refresh.nativeElement.onmouseover();
  }
  closeSuccess() {
    window.localStorage.setItem('loginMethod', "current");
    window.localStorage.setItem('loggingIn', "false");
    this.welcomeDialog.nativeElement.close();
    this.loggedIn = true;
  }

  dismiss(){
    window.localStorage.setItem('errorsOpen', 'false');
  }

    addCustomMetricOpen() {
    this.addDialog.nativeElement.showModal();
  }
    statusOpen() {
    this.statusDialog.nativeElement.showModal();
  }
   statusClose() {
    this.statusDialog.nativeElement.close();
  }
   addCustomMetricClose() {
    this.addDialog.nativeElement.close();
  }
    saveD() {
     var d = new Date();
     var date = d.getTime();
      database.ref("currentTask/" + this.userID + "/").set({
      "taskOn": "true",
      "category": this.category,
      "task": this.task,
      "description": this.description,
      "date": date,
      "name": this.name,
      "status": {"status": this.status}
    });
    this.addCustomMetricClose();
    this.category = "";
    this.task = "";
    this.description = "";
  }
      saveName() {
        if(this.name.length > 0 && this.name != "Your Name Idiot"){
     var d = new Date();
     var date = d.getTime();
      database.ref("names/" + this.userID + "/").set({
      "name": this.name,
    });
    this.closeSuccess();
        } else {
          this.name = "Your Name Idiot"
        }
  }
      saveStatus() {
     var d = new Date();
     var date = d.getTime();
      database.ref("currentTask/" + this.userID + "/status").set({
       "status": this.status,
    });
    this.statusClose();
  }

}
