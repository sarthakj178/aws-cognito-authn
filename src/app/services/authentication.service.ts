import { Injectable, Inject } from '@angular/core';
import { CognitoUserPool, CookieStorage, CognitoUserAttribute, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { CognitoAuth } from 'amazon-cognito-auth-js';
import { environment } from '../../environments/environment';
import { Observable, Observer } from '../../../node_modules/rxjs';
import { SignUpRequest } from '../model/signuprequest';
import { SignInRequest } from '../model/signinrequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userPool: CognitoUserPool;
  googleAuth: CognitoAuth;

  constructor(
    private httpClient: HttpClient,
    @Inject('location') private location: Location,
  ) { 
    this.userPool = new CognitoUserPool({
      UserPoolId: environment._USER_POOL_ID,
      ClientId: environment._CLIENT_ID,
      Storage: new CookieStorage({secure: false, domain: this.location.hostname}),
    });
    this.googleAuth = new CognitoAuth ({
      ClientId : environment._CLIENT_ID,
      AppWebDomain : environment._AUTH_CUSTOM_DOMAIN,
      TokenScopesArray : ['phone', 'email', 'profile','openid'],
      RedirectUriSignIn :  environment._REDIRECT_SIGN_IN_URI,
      RedirectUriSignOut : environment._REDIRECT_SIGN_OUT_URI,
      IdentityProvider : 'Google',
      UserPoolId : environment._USER_POOL_ID,
      Storage: new CookieStorage({secure: false, domain: this.location.hostname}),
    });
    this.googleAuth.useCodeGrantFlow();
  }

  signUp(signUpRequest: SignUpRequest) : Observable<any> {
    console.log("SignUpService.signup called", signUpRequest);
    let attributeList = [];
    attributeList.push(new CognitoUserAttribute({
      Name: 'email',
      Value: signUpRequest.email
    }));
    attributeList.push(new CognitoUserAttribute({
      Name: 'name',
      Value: signUpRequest.name
    }));
    if (signUpRequest.phone) {
      attributeList.push(new CognitoUserAttribute({
        Name: 'phone_number',
        Value: signUpRequest.phone
      }));
    }
   
    return Observable.create((observer: Observer<any>) => {
      this.userPool.signUp(signUpRequest.email, signUpRequest.password, attributeList, null, (err, result) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(result);
          observer.complete();
        }
      });
    });
  }

  signInWithGoogle() : Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.googleAuth.userhandler = {
        onSuccess: session => {
          console.log("sign in success", session);
          observer.next(true);
          observer.complete();
        },
        onFailure: err => {
          console.error("Error!", err);
          this.googleAuth.clearCachedTokensScopes();
          observer.next(false);
          observer.complete();
        }
      };
      this.googleAuth.getSession();
    });
  }
  validateAndSaveGoogleAuthToken(): Observable<Boolean> {
    return Observable.create((observer: Observer<any>) => {
      this.googleAuth.userhandler = {
        onSuccess: session => {
          console.log("validate token success", session);
          observer.next(true);
          observer.complete();
        },
        onFailure: err => {
          console.error("Error!", err);
          this.googleAuth.clearCachedTokensScopes();
          observer.next(false);
          observer.complete();
        }
      };
      this.googleAuth.parseCognitoWebResponse(window.location.href);
    });
  }

  signIn(signInRequest: SignInRequest): Observable<any> {
    let authenticationData = {
      Username: signInRequest.email,
      Password: signInRequest.password,
    };
    let authenticationDetails = new AuthenticationDetails(authenticationData);

    let userData = {
        Username: signInRequest.email,
        Pool: this.userPool,
        Storage: new CookieStorage({secure: false, domain: this.location.hostname}),
    };
    let cognitoUser = new CognitoUser(userData);
    return Observable.create((observer: Observer<any>) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          observer.next(result);
          observer.complete();
        },
        onFailure: error => observer.error(error),
      });
    });
  }


  isAuthenticated(): Observable<boolean> {
    let cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser != null) {
      return Observable.create((observer: Observer<boolean>) => {
        cognitoUser.getSession((error, session) => {
          if (error) {
            console.error(error);
            observer.next(false);
            observer.complete();
          }
          console.log(session, session.isValid());
          observer.next(session.isValid());
          observer.complete();
        });
      })
    }
    return Observable.create((observer: Observer<boolean>) => {
      observer.next(false);
      observer.complete();
    }) 
  }
  getUserAttributes(): Observable<any> {
    let cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser != null) {
      return Observable.create((observer: Observer<any>) => {
        cognitoUser.getSession((error, session) => {
          if (error || !session.isValid()) {
            console.error(error);
            observer.error(error);
          } else {
            let httpOptions = {
              headers: new HttpHeaders({ 'sj-auth-token': session.idToken.jwtToken }),
            };
            this.httpClient.post("https://api.sarthakj178.com/validate", "{}", httpOptions).subscribe(result => {
              if ('data' in result) {
                observer.next(result['data']);
                observer.complete();
              } else {
                observer.error(false);
              }
            });
          }
        });
      });
    }
    return Observable.create((observer: Observer<boolean>) => {
      observer.next(false);
      observer.complete();
    });
  }
  signOut(): void {
    let cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.signOut();
    }
  }

  forgotPassword(email: string): Observable<any> {
    
    let cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.userPool
    });
    return Observable.create((observer: Observer<any>) => {
      cognitoUser.forgotPassword({
        onSuccess: result => {
          console.log(result);
          observer.next(result);
          observer.complete();
        }, onFailure: error => {
          console.log(error);
          observer.error(error);
        }
      })
    });
  }
}
