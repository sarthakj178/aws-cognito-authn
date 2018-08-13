import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';
import { Observable } from '../../../node_modules/rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
})
export class OauthComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authenticationService.validateAndSaveGoogleAuthToken().subscribe(isValid => {
      console.log("isValid", isValid);
      if (isValid) {
        this.router.navigate(['/f1/dashboard']);
      } else {
        this.router.navigate(['/f1/signin']);
      }
    });
  }

}
