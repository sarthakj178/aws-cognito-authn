import { Component, OnInit, Inject } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '../../../../node_modules/@angular/router';
import { Profile } from '../../model/profile';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  profile: Profile = {
    name: '',
    email: '',
    phone: ''
  }
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authenticationService.isAuthenticated().subscribe(result => {
      if (!result) {
        this.router.navigate(['f1/signin']);
      } else {
        this.authenticationService.getUserAttributes().subscribe(userAttributes => {
          this.profile.email = userAttributes.email;
          this.profile.name = userAttributes.name;
          this.profile.phone = userAttributes.phone_number;
        })
      }
    });
  }

}
