import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

declare var componentHandler: any;
declare var database: any;
declare var firebase: any;
declare var dialogPolyfill: any;

@Component({
  moduleId: module.id,
  selector: 'my-adddata',
  templateUrl: 'adddata.component.html',
})

export class AddDataComponent implements AfterViewInit, OnInit {
  finance: number = 0;
  happiness: number = 0;
  exercise: number = 0;
  nutrition: number = 0;
  sleep: number = 0;
  alcohol: number = 0;
  loggedIn: boolean = false;
  userID: number;
  lastData: number;
  document: any = document;
  one: boolean = true;


  financeSet: boolean = false;
  happinessSet: boolean = false;
  exerciseSet: boolean = false;
  nutritionSet: boolean = false;
  sleepSet: boolean = false;
  alcoholSet: boolean = false;
  settingsOrganized: any = [];

  newUser: boolean = false;


  @ViewChild('errorDialog') dialog: any;
  @ViewChild('successDialog') successDialog: any;
  @ViewChild('newDialog') newDialog: any;
  @ViewChild('fakeDialog') fakeDialog: any; 
  @ViewChild('fakeDialogSuccess') fakeDialogSuccess: any; 

  ngAfterViewInit(): any {
    componentHandler.upgradeDom();
     dialogPolyfill.registerDialog(this.dialog.nativeElement);    
     dialogPolyfill.registerDialog(this.newDialog.nativeElement);
    dialogPolyfill.registerDialog(this.successDialog.nativeElement);
    dialogPolyfill.registerDialog(this.fakeDialog.nativeElement);  
    dialogPolyfill.registerDialog(this.fakeDialogSuccess.nativeElement); 
    this.document = document; 
  }
  ngOnInit(): any {
    var me = this;
    this.newUser = window.localStorage.getItem('newAddData') == "true" ? true : false;
    firebase.auth().onAuthStateChanged(function (user: any) {
      if (user) {
        me.loggedIn = true;
        me.userID = user.uid;
        me.getSettings();
        me.newUser ?  me.openDialog(me.newDialog) : me.getData();
      } else {
        me.loggedIn = false;
      }
    });
  }
  getSettings() {
    var me = this;
    database.ref('settings/' + this.userID).on('value', function (snapshot: any) {
      me.updateSettings(snapshot.val());
    });
  }
  updateSettings(settings: any) {
    if(settings){
    var me = this;
    me.settingsOrganized = [];
    var settings = settings.settings ? settings.settings : [];
    settings.forEach(function(x){
      var yes = false;
      var selectedArray = [];
      x.forEach(function(a){
        a.selected ? (yes = true, selectedArray.push(a) ) : false;
      });
      yes ? me.settingsOrganized.push(selectedArray) : false;
    });
    }
    setTimeout(function(){componentHandler.upgradeDom();}, 500)
  }
  saveData() {
    if (this.loggedIn) {
      var d = new Date();
      var date = d.getTime();
      if (this.lastData && (+this.lastData > 1)) {
        var lastDate: any = new Date(this.lastData);
        if ((d.getDate() != lastDate.getDate()) || (d.getMonth() != lastDate.getMonth()) || (d.getFullYear() != lastDate.getFullYear())) {
          this.saveD(date);
        } else {
          this.dialog.nativeElement.showModal();
        }
      } else {
        this.saveD(date);
      }
    }
  }
  createFakeData(){
    this.fakeDialog.nativeElement.showModal();
  }
  createFakeDataProceed(){
    this.fakeDialog.nativeElement.close();
    database.ref("data/" + this.userID).remove();
    var time = 86400000 * 100;
    for (var i = 0; i < 100; i++){
    this.settingsOrganized.forEach(function(x){ 
      x.forEach(function(a){
        if(a.valueType == "range"){
          a.value = Math.floor(Math.random() * a.max);
        } else {
          a.value = Math.floor(Math.random() * a.max);
        }
      });
    });
    var d = new Date();
        var date = d.getTime();
        date = date - time;
        this.saveD(date, true);
        time -= 86400000;
    }
    this.fakeDialogSuccess.nativeElement.showModal();
  }
  saveD(date, flag?) {
    var data = {
      "time": date
    };
    this.settingsOrganized.forEach(function(x){ 
      x.forEach(function(a){
        data[a.measurement] = a.value;
      });
    });
    database.ref("data/" + this.userID + "/").push({"data": data});
    flag ? false : this.successDialog.nativeElement.showModal();
  }
  getData() {
    var me = this;
    database.ref('data/' + this.userID).limitToLast(1).on('value', function (snapshot: any) {
      me.updateData(snapshot.val());
    });
  }
  updateData(data: any) {
    if (data) {
      for (var d in data) {
        this.lastData = data[d].data.time ? data[d].data.time : false;
      }
    }
  }
  closeDialog() {
    this.dialog.nativeElement.close();
  }
  closeFakeSuccessDialog(){
    this.fakeDialogSuccess.nativeElement.close();
  }
  closeFakeDialog(){
    this.fakeDialog.nativeElement.close();
  }
  dashboard() {
    this.dialog.nativeElement.close();
    window.location.pathname = "my-app/dashboard";
  }
  closeSuccessDialog() {
    this.successDialog.nativeElement.close();
  }
  dashboardSuccess() {
    this.successDialog.nativeElement.close();
    window.location.pathname = "my-app/dashboard";
  }
  dashboardFake() {
    this.fakeDialogSuccess.nativeElement.close();
    window.location.pathname = "my-app/dashboard";
  }
  closeNewDialog() {
    this.newDialog.nativeElement.close();
    window.localStorage.setItem('newAddData', "false");
    window.localStorage.setItem('newDashboard', "true");
    window.location.pathname = "my-app/dashboard";
  }
  openDialog(d) {
    setTimeout(function () { d.nativeElement.showModal(); }, 1500);
  }
}
