import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent} from './index/index.component';

import { SignInComponent as F1SignInComponent} from './f1/signin/signin.component';
import { SignUpComponent as F1SignUpComponent } from './f1/signup/signup.component';
import { IndexComponent as F1IndexComponent } from './f1/index/index.component';
import { DashboardComponent as F1DashboardComponent} from './f1/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: IndexComponent },

  { path: 'f1', component: F1IndexComponent },
  { path: 'f1/signin', component: F1SignInComponent },
  { path: 'f1/signup', component: F1SignUpComponent },
  { path: 'f1/dashboard', component: F1DashboardComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
