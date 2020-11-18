import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { MatchingValidatorDirective } from '../add-user/matching-validator.directive';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  hidePassword = true;
  hidePasswordConfirm = true;
  private userName:string;
  private validated:boolean=false;

  resetPasswordForm = this.fb.group({
    password: [null,Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")],
    passwordConfirm: [null,[Validators.required] ],    
  });  
  
  constructor(
    private fb: FormBuilder,
    private globals: Globals, 
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
    ) {}
  ngOnInit(){
    this.globals.checkTheme();
    let param = new HttpParams();    
    param = param.append('ResetCode', this.route.snapshot.queryParams.reset);
    this.http.get<any>(this.globals.getApiUrl()+'api/checkSPMailUserPasswordResetCode.php',{params: param}).subscribe({
      next: data => {
        this.userName = data.LoginUserName;
        this.validated=true;
        console.log(data)
      },
      error: error => {
        this._snackBar.open(error.error.ErrorMsg,"OK",{duration:5000} );
        this.resetPasswordForm.disable();
      }
    });
  }
  onSubmit() {
    if(this.validated){
      if(this.resetPasswordForm.value.passwordConfirm!=this.resetPasswordForm.value.password){console.log("error")}
      else{        
        if(this.resetPasswordForm.valid) {
          let update = new FormData;
          update.append('ResetCode',this.route.snapshot.queryParams.reset);
          update.append('UserName',this.userName);
          update.append('UserPwd1', this.resetPasswordForm.value.password)
          update.append('UserPwd2', this.resetPasswordForm.value.passwordConfirm)
          this.http.post<any>(this.globals.getApiUrl()+'api/resetSPMailUserPasswordByCode.php',update).subscribe({
            next: data => {
              //getTheme before navigation
              this.getTheme(data.AuthToken,data.SystemUserName)
              //setGlobals
              this.globals.setAuthToken(data.AuthToken);
              this.globals.setSystemUserName(data.SystemUserName);
              this.globals.setUserName(this.userName);

              this._snackBar.open("Password Reset Successfully","OK",{duration:5000} );
              },
              error: error => {
                this._snackBar.open(error.error.ErrorMsg,"OK",{duration:5000} );
              }
              });

              } else {
        }
      }
    }
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

}
