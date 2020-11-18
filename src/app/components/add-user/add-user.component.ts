import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private globals: Globals,
    private fb: FormBuilder, 
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {route: ActivatedRoute}
  ) {
    data.route.params.subscribe(params => {this.id = params['id']});
    dialogRef.disableClose = true;
  }
  
  private id;
  addUserForm = this.fb.group({
    emailAddress: [null,[Validators.required,Validators.pattern("^[a-z0-9._%+-]{2,}@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    name: [null, Validators.required],
    password: [null,[Validators.required,Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")]],
    passwordConfirm: [null,Validators.required],
    
  });
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  get primEmail(){
    return this.addUserForm.get('emailAddress')
    }
  getEmailPrefix(str:string){
    return str.substring(0, str.indexOf("@")); 
  }
  onSubmit(){
    let form = new FormData;
    
    
    form.append('AuthToken',this.globals.getAuthToken());
    form.append('UserName',this.globals.getSystemUserName());
    form.append('PersonalName',this.addUserForm.value.name);
    form.append('EmailAddress',this.addUserForm.value.emailAddress);
    form.append('NewUserName',this.getEmailPrefix(this.addUserForm.value.emailAddress));
    form.append('CompanyId',this.id);
    form.append('UserPwd1',this.addUserForm.value.password);
    form.append('UserPwd2',this.addUserForm.value.passwordConfirm);
    
    
    this.http.post<any>(this.globals.getApiUrl()+'api/addSPMailCompanyUser.php', form).subscribe({
      next: data => {
        console.log("User added successfully")
        this.dialogRef.close();
      },
      error: error => {
        if(error.error.ErrorMsg=="The user email address does not belong to a company domain"){
          console.error('Email address domain does not match a on added to this company. Please see details page.');
        };
        if(error.error.ErrorMsg=="Cannot add user due to validation errors."){
          console.error('Passwords do not match.');
        };
      }
    });
  }
  ngOnInit(){
  }
}
