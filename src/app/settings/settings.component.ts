import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
declare var componentHandler: any;
declare var database: any;
declare var firebase: any;
declare var dialogPolyfill: any;

@Component({
  moduleId: module.id,
  selector: 'my-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.css']
})
export class SettingsComponent implements AfterViewInit, OnInit {
   one: boolean = true;
    two: boolean = true;
    three: boolean = false;
  finance: boolean = false;
  happiness: boolean = false;
  exercise: boolean = false;
  nutrition: boolean = false;
  sleep: boolean = false;
  alcohol: boolean = false;
  loggedIn: boolean = false;
  userID: number;
  newUser: boolean = false;
  addInputRange: boolean = false;
  addInputNumber: boolean = false;
  customMax: string = "";
  addMetricName: string = "";
  settingsOrganized: any[] = [
    [
    //basic
    { measurement: "Steps Taken", x: "steps", max: "25000", category: "Movement", valueType: "number", selected: false, value: "", icon: "directions_walk" },
    { measurement: "Miles Walked", x: "miles", max: "25", category: "Movement", valueType: "number", selected: false, icon: "directions_walk", value: "" },
    ],
    [
    //finance
    { measurement: "Money Spent", x: "dollars", max: "1000", category: "Finance", valueType: "number", selected: false, icon: "attach_money", value: "" },
    { measurement: "Money Saved", x: "dollars", max: "1000", category: "Finance", valueType: "number", selected: false, icon: "attach_money", value: "" },
    { measurement: "Money Earned", x: "dollars", max: "1000", category: "Finance",valueType: "number", selected: false, icon: "attach_money", value: "" },
    ],
    [
    //metnal health
    { measurement: "Happiness", max: "100", category: "Mental Health", valueType: "range", selected: false, icon: "mood", value: "0" },
    { measurement: "Calmness", max: "100", category: "Mental Health", valueType: "range", selected: false, icon: "sentiment_satisfied", value: "0" },
    { measurement: "Anxiety", max: "100", category: "Mental Health", valueType: "range", selected: false, icon: "sentiment_very_dissatisfied", value: "0" },
    { measurement: "Depression", max: "100", category: "Mental Health", valueType: "range", selected: false, icon: "sentiment_neutral", value: "0" },
    ],
    [
    //physical
    { measurement: "Exercise Overall", max: "100", category: "Exercise", valueType: "range", selected: false, icon: "access_time", value: "0" },
    { measurement: "Exercise Duration", x: "minutes", max: "300", category: "Exercise", valueType: "number", selected: false, icon: "access_time", value: "" },
    { measurement: "Exercise Intensity", x: "steps", max: "100", category: "Exercise", valueType: "range", selected: false, icon: "directions_run", value: "0" },
    ],
    [
    //
    { measurement: "Weight", max: "400", x: "lbs", category: "Body Composition",  valueType: "number", selected: false, icon: "line_weight", value: "" },
    { measurement: "BMI", max: "35", x: "%", category: "Body Composition", valueType: "number", selected: false, icon: "line_weight", value: "" },
    ],
    [
    //nutrition
    { measurement: "Nutrition Overall", max: "100", category: "Nutrition", valueType: "range", selected: false, icon: "local_pizza", value: "0" },
    { measurement: "Nutrition Calories", x: "cal", max: "5000", category: "Nutrition", valueType: "number", selected: false, icon: "local_pizza", value: "" },
    { measurement: "Nutrition Quality", max: "100", category: "Nutrition", valueType: "range", selected: false, icon: "local_pizza", value: "0" },
    ],
    [
    //sleep
    { measurement: "Sleep Hours", x: "hours", max: "14", category: "Sleep", valueType: "number", selected: false, icon: "snooze", value: "" },
    { measurement: "Sleep Quality", max: "100", category: "Sleep", valueType: "range", selected: false, icon: "snooze", value: "0" },
    ],
    [
    //drugs
    { measurement: "Alcohol", x: "drinks", max: "25", category: "Drugs", valueType: "number", selected: false, icon: "local_bar", value: "" },
    { measurement: "Cigarettes", x: "smokes", max: "35", category: "Drugs", valueType: "number", selected: false, icon: "smoking_rooms", value: "" },
    { measurement: "Drugs", x: "drugs", max: "100", category: "Drugs", valueType: "number", selected: false, icon: "smoke_free", value: "" },
    ],
    [
     //custom 
    ]

  ];
  @ViewChild('successDialog') successDialog: any;
  @ViewChild('newDialog') newDialog: any;
  @ViewChild('addDialog') addDialog: any;
  @ViewChild('vid') vid: any;
  @ViewChild('innerVid') innerVid: any;
  
  ngAfterViewInit(): any {
    componentHandler.upgradeDom();
    dialogPolyfill.registerDialog(this.successDialog.nativeElement);
    dialogPolyfill.registerDialog(this.newDialog.nativeElement);
    dialogPolyfill.registerDialog(this.addDialog.nativeElement);
  }
  ngOnInit(): any {
    var me = this;
    this.newUser = window.localStorage.getItem('newSettings') == "true" ? true : false;
    firebase.auth().onAuthStateChanged(function (user: any) {
      if (user) {
        me.loggedIn = true;
        me.userID = user.uid;
        me.newUser ? me.openDialog(me.newDialog) : me.getSettings();
      } else {
        me.loggedIn = false;
        //me.settings = new Settings();
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
    if (settings) {
     if (settings.settings) {
       this.settingsOrganized = settings.settings;
      }
    }
  }
  saveSettings() {
    if (this.loggedIn) {
      database.ref("settings/" + this.userID + "/").set(
        {
          "settings": this.settingsOrganized
        }
      );
      this.successDialog.nativeElement.showModal();
    }
  }
  addCustomMetricOpen() {
    this.addDialog.nativeElement.showModal();
  }
  addCustomMetric() {
    var valueType = this.addInputNumber ? "number" : this.addInputRange ? "range" : false;
    if (valueType) {
      if(this.addMetricName.length > 0){
      var metric = { measurement: this.addMetricName, category: "Custom Metrics", valueType: valueType, 
        selected: true, icon: "all_inclusive", value: valueType == "number" ? "" : "0", max: valueType == "range" ? "100" : this.customMax};
        if(this.settingsOrganized[this.settingsOrganized.length-1][0].category == "Custom Metrics"){
           this.settingsOrganized[this.settingsOrganized.length-1].push(metric);
        } else {
           this.settingsOrganized.push([metric]);
        }
      }
    }
    this.addDialog.nativeElement.close();
  }
  addCustomMetricClose() {
    this.addDialog.nativeElement.close();
  }
  closeSuccessDialog() {
    this.successDialog.nativeElement.close();
  }
  dashboardSuccess() {
    this.successDialog.nativeElement.close();
    window.location.pathname = "my-app/dashboard";
  }
  closeNewDialog() {
    this.newDialog.nativeElement.close();
    window.localStorage.setItem('newSettings', "false");
    window.localStorage.setItem('newAddData', "true");
    window.location.pathname = "my-app/adddata";
  }
  openDialog(d) {
    setTimeout(function () { d.nativeElement.showModal(); }, 1500);
  }
}
