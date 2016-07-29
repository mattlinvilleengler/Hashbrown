import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
declare var componentHandler: any;
declare var firebase: any;
declare var dialogPolyfill: any;

@Component({
  moduleId: module.id,
  selector: 'my-landing',
  templateUrl: 'landing.component.html'
})
export class LandingComponent implements AfterViewInit{
    provider = new firebase.auth.GoogleAuthProvider();
    email: string;
    password: string;
    emailRegister: string;
    passwordRegister: string;
    one: boolean = true;
    two: boolean = false;
    three: boolean = false;
    scrolled: boolean = false;
    pos: string = "block";
    top: any = 0;
    left: any = 0;
    contentTop: number = 0;
    contentPosition: string ="block";
    contentLeft: number = 0;
    cTop: number = 0;
    cLeft: number = 0;
    logTop: number = 0;
    logLeft: number = 0;
     w: any = "auto";
     op:number = 1;

  @ViewChild('loginDialog') loginDialog: any;
  @ViewChild('registerDialog') registerDialog: any;
  @ViewChild('mainBox') mainBox: any;
  @ViewChild('mainFlip') mainFlip: any;
  @ViewChild('contentBox') contentBox: any;
  @ViewChild('bigBox') bigBox: any;
  
flip(){
  if(window.innerWidth > 990){
  if( document.getElementsByClassName("mdl-layout__content")[0].scrollTop > 20){
 this.scrolled = true;
 this.pos ="absolute";
 this.left = (window.innerWidth - 355) + "px";
 this.top = -10;
 this.contentTop = 75;
 this.contentPosition = "absolute"
 this.op = 0;
  }else {
     this.scrolled = false;
     this.pos ="absolute";
    this.left = this.logLeft;
    this.top = this.logTop;
    this.contentTop = this.cTop;
     this.contentLeft = this.cLeft;
     this.contentPosition = "absolute";
     this.op = 1;
  }
  }
}
setTheStuff(){
 this.top = this.mainFlip.nativeElement.offsetTop;
 this.left = this.mainFlip.nativeElement.offsetLeft + "px";
 this.w = this.mainFlip.nativeElement.clientWidth + "px";
 this.contentTop = this.contentBox.nativeElement.offsetTop;
 this.contentLeft = this.contentBox.nativeElement.offsetLeft; 
 this.cTop = this.contentTop;
 this.cLeft = this.contentLeft;
 this.logTop = this.top;
 this.logLeft = this.left;

}
signInRe(){
  var me = this;
  window.localStorage.setItem('loginMethod','current');
  window.localStorage.setItem('loggingIn','true');
  this.closeLoginDialog();
  firebase.auth().signInWithRedirect(this.provider);
}
 ngAfterViewInit():any {
     var me = this;
     window.ondblclick = function(){ me.flip(); };
     me.setTheStuff();
     document.getElementsByClassName("mdl-layout__content")[0].addEventListener('scroll', function(){ me.flip(); });
     componentHandler.upgradeDom();
     dialogPolyfill.registerDialog(this.loginDialog.nativeElement);    
     dialogPolyfill.registerDialog(this.registerDialog.nativeElement);
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
  window.localStorage.setItem('loginMethod','current');
  window.localStorage.setItem('loggingIn','true');
  this.closeLoginDialog();
  firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function(error: any) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
}
    register(){
        window.localStorage.setItem('loginMethod','new');
        window.localStorage.setItem('loggingIn','true');
        this.closeRegisterDialog();
firebase.auth().createUserWithEmailAndPassword(this.emailRegister, this.passwordRegister).catch(function(error:any) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
    }
    registerGoogle(){
        window.localStorage.setItem('loginMethod','new');
        window.localStorage.setItem('loggingIn','true');
        this.closeRegisterDialog();
firebase.auth().signInWithRedirect(this.provider).then(function(result:any) {
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

        closeRegisterDialog(){
          this.registerDialog.nativeElement.close();
        }
         closeLoginDialog(){
          this.loginDialog.nativeElement.close();
        }
         openRegister(){
        this.registerDialog.nativeElement.showModal();
        }
         openLogin(){
        this.loginDialog.nativeElement.showModal();
        }
}