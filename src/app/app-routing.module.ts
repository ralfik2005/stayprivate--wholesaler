import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './companies/companies.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyDetailComponent } from './components/company-detail/company-detail.component';
import { LoginTwoComponent } from './login-two/login-two.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { TableComponent } from './table/table.component';
import { TreeComponent } from './tree/tree.component';
import { EditThemeComponent } from './components/edit-theme/edit-theme.component';
import { AuthGuard } from './components/login/auth.guard';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { MyCompanyComponent } from './components/my-company/my-company.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard] },
  { path: 'companies', component: CompaniesComponent,canActivate:[AuthGuard]  },
  { path: 'detail/:id', component: CompanyDetailComponent,canActivate:[AuthGuard]  },
  { path: 'mycompany', component: MyCompanyComponent,canActivate:[AuthGuard]  },
  { path: 'account', component: MyAccountComponent,canActivate:[AuthGuard]  },
  { path: 'login-two', component: LoginTwoComponent,canActivate:[AuthGuard]  },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'reset', component: ResetPasswordComponent},
  { path: 'home', component: HomeComponent,canActivate:[AuthGuard]  },
  { path: 'add-company', component: AddCompanyComponent ,canActivate:[AuthGuard] },
  { path: 'edit-theme', component: EditThemeComponent ,canActivate:[AuthGuard] },
  { path: 'table', component: TableComponent,canActivate:[AuthGuard]  },
  { path: 'tree', component: TreeComponent,canActivate:[AuthGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }