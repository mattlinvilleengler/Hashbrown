import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var componentHandler: any;
declare var firebase: any;
@Component({
  moduleId: module.id,
  selector: 'my-register',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements AfterViewInit {
    provider = new firebase.auth.GoogleAuthProvider();
    email: string;
    password: string;

    ngAfterViewInit():any {
    componentHandler.upgradeDom();
    }



}