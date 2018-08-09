import { Component, OnInit } from '@angular/core';
import {SignInRequest} from '../../model/signinrequest';
import { Router } from '../../../../node_modules/@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
})
export class SignInComponent implements OnInit {
  signInRequest: SignInRequest = {
    email: '',
    password: '',
  }
  alerts: Array<any> = [];
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authenticationService.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/f1/dashboard']);
      }
    })
  }
  signIn() {
    console.log('signin', this.signInRequest);
    this.authenticationService.signIn(this.signInRequest).subscribe(result => {
      console.log(result);
      this.router.navigate(['/f1/dashboard']);
    }, error => {
      console.error(error);
      let msg = "Error while Signing in!";
      if (error.code == "NotAuthorizedException") {
        msg = "Invalid Email Address/password!";
      }  
      let alert = {
        type: 'danger',
        message: msg,
        show: true,
      }
      this.alerts.push(alert);
      setTimeout(() => this.closeAlert(alert), 5000);

    });
  }
  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
    alert.show = false;
  }

}
