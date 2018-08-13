import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { AppRoutingModule } from './app-routing.module';

import { IndexComponent as F1IndexComponent} from './f1/index/index.component';
import { SignInComponent as F1SignInComponent } from './f1/signin/signin.component';
import { SignUpComponent as F1SignUpComponent } from './f1/signup/signup.component';
import { HeaderComponent as F1HeaderComponent} from './f1/header/header.component';
import { DashboardComponent as F1DashboardComponent} from './f1/dashboard/dashboard.component';
import { OauthComponent } from './oauth/oauth.component';

@NgModule({
  declarations: [
    AppComponent,
    F1SignInComponent,
    F1SignUpComponent,
    IndexComponent,
    F1IndexComponent,
    F1HeaderComponent,
    F1DashboardComponent,
    OauthComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    { provide: 'location', useValue: location },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
