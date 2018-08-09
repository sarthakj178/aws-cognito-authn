import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  checkingAuth: Boolean = true;
  isAuthenticated: Boolean = false;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authenticationService.isAuthenticated().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.checkingAuth = false;
    })
  }
  signOut() {
    this.authenticationService.signOut();
    this.router.navigate(['f1/signin']);
  }

}
