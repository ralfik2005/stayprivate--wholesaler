import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule }from '@swimlane/ngx-charts';

import { CompaniesComponent } from './companies/companies.component';
import { CompanyDetailComponent } from './components/company-detail/company-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginTwoComponent } from './login-two/login-two.component';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { TableComponent } from './table/table.component';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { LoginComponent } from './components/login/login.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { TreeComponent } from './tree/tree.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LineGraphComponent } from './components/line-graph/line-graph.component';
import { Globals } from './globals';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { EditThemeComponent } from './components/edit-theme/edit-theme.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { CompanyStatsComponent } from './components/company-stats/company-stats.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { MatchingValidatorDirective } from './components/add-user/matching-validator.directive';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { MyCompanyComponent } from './components/my-company/my-company.component';
import { EditPasswordComponent } from './components/edit-password/edit-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { CompanyCheckerComponent } from './components/company-checker/company-checker.component'

@NgModule({
  declarations: [
    AppComponent,
    CompaniesComponent,
    CompanyDetailComponent,
    MessagesComponent,
    DashboardComponent,
    LoginTwoComponent,
    NavigationComponent,
    TableComponent,
    LoginComponent,
    CompanyListComponent,
    TreeComponent,
    ForgotPasswordComponent,
    HomeComponent,
    LineGraphComponent,
    AddCompanyComponent,
    EditThemeComponent,
    UserListComponent,
    CompanyStatsComponent,
    AddUserComponent,
    MatchingValidatorDirective,
    MyAccountComponent,
    MyCompanyComponent,
    EditPasswordComponent,
    ResetPasswordComponent,
    CompanyCheckerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatSliderModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
    // ),
    NgxChartsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatMenuModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    LayoutModule,
    MatToolbarModule,    
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTreeModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
