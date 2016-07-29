import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
declare var componentHandler: any;
declare var firebase: any;

@Component({
  moduleId: module.id,
  selector: 'my-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements AfterViewInit {
    
    provider = new firebase.auth.GoogleAuthProvider();
    email: string;
    password: string;
    signInPopUp(){
    firebase.auth().signInWithPopup(this.provider).then(function(result:any) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
 }).catch(function(error:any) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
}
signInRe(){
  firebase.auth().signInWithRedirect(this.provider);
}
 ngAfterViewInit():any {
   componentHandler.upgradeDom();
firebase.auth().getRedirectResult().then(function(result:any) {
  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // ...
  }
  // The signed-in user info.
  var user = result.user;
}).catch(function(error:any) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
}
signInFitSocial(){
alert(this.email + " " + this.password)
  firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function(error: any) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
}
}