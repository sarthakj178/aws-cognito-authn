import { Component, OnInit } from '@angular/core';
import {SignInRequest} from '../model/signinrequest';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit {
  signInRequest: SignInRequest = {
    username: '',
    password: '',
  };
  constructor() { }

  ngOnInit() {
  }

}
