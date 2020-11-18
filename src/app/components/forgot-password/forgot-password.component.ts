import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{

  forgotPasswordForm = this.fb.group({
    email: [null, Validators.required]
  });
  
  constructor(
    private fb: FormBuilder,
    private globals: Globals, 
    private http: HttpClient,    
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(){
    this.globals.checkTheme();
  }
  onSubmit() {
    if(this.forgotPasswordForm.valid) {
      let form = new FormData;
      form.append('EmailAddress',this.forgotPasswordForm.value.email);
          
      this.http.post<any>(this.globals.getApiUrl()+'api/genSPMailUserPasswordResetLink.php', form).subscribe({
        next: data => {
          this._snackBar.open("Link Sent!","OK",{duration:5000} );
          this.router.navigate(["/login"]);
        },
        error: error => {
          this._snackBar.open(error.error.ErrorMsg,"OK",{duration:5000} );
        }
      });
    } else {
    }    
  }
}
