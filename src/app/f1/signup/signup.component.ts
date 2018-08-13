import { Component, OnInit } from '@angular/core';
import { SignUpRequest } from '../../model/signuprequest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignUpComponent implements OnInit {
  signUpRequest: SignUpRequest = {
    email: '',
    password: '',
    name: '',
    phone: '',
  };
  form: FormGroup;
  alerts: Array<any> = [];

  constructor(
    private formBuilder: FormBuilder, 
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      name: [null, Validators.required],
      phone: [null],
    });
  }
  signUp () {
    if (this.form.valid) {
      this.signUpRequest.email = this.form.value.email;
      this.signUpRequest.password = this.form.value.password;
      this.signUpRequest.name = this.form.value.name;
      this.signUpRequest.phone = this.form.value.phone;
      console.log('signup', this.signUpRequest);
      this.authenticationService.signUp(this.signUpRequest).subscribe(result => {
        console.log("sign up success", result);
        let alert = {
          type: 'success',
          message: 'Successfully signed up!',
          show: true,
        }
        this.alerts.push(alert);
        setTimeout(() => this.closeAlert(alert), 5000);
      }, err => {
        console.error(err);
        let msg = "Error while Signing up!";
        if (err.code == 'UsernameExistsException') {
          msg = "A user with this email Address already exists";
        }
        let alert = {
          type: 'danger',
          message: msg,
          show: true,
        }
        this.alerts.push(alert);
        setTimeout(() => this.closeAlert(alert), 5000);
      });
    } else {
      // validate all form fields
    }
  }
  signUpWithGoogle() {
    this.authenticationService.signInWithGoogle().subscribe(result => {
      console.log("sign up success", result);
      let alert = {
        type: 'success',
        message: 'Successfully signed up!',
        show: true,
      }
      this.alerts.push(alert);
      setTimeout(() => this.closeAlert(alert), 5000);
    }, err => {
      console.error(err);
      let msg = "Error while Signing up!";
      if (err.code == 'UsernameExistsException') {
        msg = "A user with this email Address already exists";
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
