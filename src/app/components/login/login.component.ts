import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private globals: Globals, 
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  
  img:string
  loginForm = this.fb.group({
    UserName: [this.globals.defaultUsername, Validators.required],
    UserPwd: [this.globals.defaultUserPwd, Validators.required]
  });

  ngOnInit(): void {
    if(localStorage.getItem("img-url")!=null){
      this.img=(this.globals.getImgUrl()+localStorage.getItem("img-url")+"logo-small.png?t="+new Date().getTime())
    }else{this.img="/assets/images/SP_Logo_Icon+Text_Blue.svg"}
    this.globals.checkTheme();
    
  }

  hidePassword = true;

  onSubmit() {
    if(this.loginForm.valid) {
      this.loginSend(this.loginForm.value);
    } else {
    }
    
  }

  loginSend(loginData){

    let login = new FormData;
    
    login.append('UserName',loginData.UserName);
    login.append('UserPwd',loginData.UserPwd);
    // login.append('CompanyId',this.globals.getCompanyId());
    
    this.http.post<any>(this.globals.getApiUrl()+'api/authSPMailUserLogin.php', login).subscribe({
      next: data => {
        //getTheme before navigation
        this.getTheme(data.AuthToken,data.SystemUserName)
        this.getCompanyType(data.AuthToken,data.SystemUserName)
        //setGlobals
        this.globals.setAuthToken(data.AuthToken);
        this.globals.setSystemUserName(data.SystemUserName);
        this.globals.setUserName(loginData.UserName);
        
      },
      error: error => {
        this._snackBar.open(error.error.ErrorMsg,"OK",{duration:5000} );
      }
    });

  }
  getTheme(authToken:string,userName:string){
    let param = new HttpParams();
    param = param.append('AuthToken',authToken);
    param = param.append('UserName', userName);
    
    this.http.get<any>(this.globals.getApiUrl()+'api/getSPMailCompanyTheme.php', {params:param}).subscribe({
      next: themedata => {        
        //setLocalStorage
        localStorage.setItem('background-color', themedata["background-color"]);
        localStorage.setItem('foreground-color', themedata["foreground-color"]);
        localStorage.setItem('highlight-color', themedata["highlight-color"]);
        localStorage.setItem('border-color', themedata["border-color"]);
        localStorage.setItem('img-url', themedata.logo);
        localStorage.setItem('app-name', themedata["app-name"]);
        //navigate
        this.router.navigate(["/home"])
      },
      error: error => {
         console.error('There was an error!');
      }
    });
  }
  getCompanyType(authToken:string,userName:string){
      let param = new HttpParams();
        param = param =param.append('AuthToken',authToken);
        param = param.append('UserName', userName);
        this.http.get<any>(this.globals.getApiUrl()+'api/getSPMailCompanyInfo.php', {params:param}).subscribe({next: data => 
      {      
      if (data.SPMCompanyType=="S"){this.globals.setCompanyType("Super")}
      if (data.SPMCompanyType=="W"&&data.IsDealerFlag=="N"){this.globals.setCompanyType("Wholesaler")}
      if (data.SPMCompanyType=="W"&&data.IsDealerFlag=="Y"){this.globals.setCompanyType("Dealer")}
      if (data.SPMCompanyType=="R"){this.globals.setCompanyType("Reseller")}
      if (data.SPMCompanyType=="C"){this.globals.setCompanyType("Client")}
    },
      error: error => 
      {console.error('There was an error!');}
    });
  }
}
