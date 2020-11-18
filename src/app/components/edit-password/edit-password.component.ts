import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {
  hidePasswordCurrent = true;
  hidePassword = true;
  hidePasswordConfirm = true;
  constructor(private fb:FormBuilder,private globals:Globals,private http:HttpClient,public dialogRef: MatDialogRef<EditPasswordComponent>,private _snackBar: MatSnackBar) { dialogRef.disableClose = true;}
  passwordForm = this.fb.group({
    passwordCurrent: [null,Validators.required],
    password: [null,Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")],
    passwordConfirm: [null,Validators.required ],    
  });  
  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(){
    if(this.passwordForm.value.passwordConfirm!=this.passwordForm.value.password){console.log("error")}
    else{
      let update = new FormData;
    update.append('AuthToken',localStorage.getItem("AuthToken"));
    update.append('UserName',localStorage.getItem("systemUserName"));
    update.append('OldUserPwd', this.passwordForm.value.passwordCurrent)
    update.append('NewUserPwd1', this.passwordForm.value.password)
    update.append('NewUserPwd2', this.passwordForm.value.passwordConfirm)
    
    this.http.post<any>(this.globals.getApiUrl()+'api/editSPMailCompanyUserPwd.php', update).subscribe({
      next: data => {
        console.log(data)
        this.dialogRef.close();
      },
      error: error => {
        this._snackBar.open(error.error.FieldErrorList[0].FieldError,"OK",{duration:5000} );
         console.error('There was an error!');
      }
    });
    }
  }
}
