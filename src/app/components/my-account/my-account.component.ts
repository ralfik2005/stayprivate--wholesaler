import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Globals } from 'src/app/globals';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { EditPasswordComponent } from '../edit-password/edit-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})

export class MyAccountComponent implements OnInit {
  editMode= false;

  constructor(public dialog: MatDialog, private fb: FormBuilder,private globals:Globals,private http:HttpClient, private breakpointObserver: BreakpointObserver,private router:Router) {}
  appName =localStorage.getItem('app-name')
  myCompanyId= this.globals.getCompanyId();
  myCompanyType=this.globals.getCompanyType();
  mode = new FormControl('side');
  start : string;

  myEmail:string;
  myUsername:string;
  myName:string;

  detailsForm = this.fb.group({
    emailAddress: [null],
    username:[null],
    name: [null, Validators.required],   
  });
  
  ngOnInit(): void {
    this.globals.refreshAuth();
    this.globals.checkTheme();
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mode = new FormControl('over');
          this.start = 'false';
        } else {
          this.mode = new FormControl('side');
          this.start = 'true';
        }
      });

      let param = new HttpParams();
      param = param.append('AuthToken',this.globals.getAuthToken());
      param = param.append('UserName', this.globals.getSystemUserName());
      this.http.get<any>(this.globals.getApiUrl()+'api/getSPMailCompanyUsers.php',{params:param}).subscribe({next: data => 
    {
      
      for(let user of data.UserList){
        console.log(this.detailsForm)
        if(this.globals.getSystemUserName() == user.UserName){
          this.detailsForm = this.fb.group({
            emailAddress: [{value: user.EmailAddress,disabled:true}],
            username:[{value: user.LoginUserName,disabled:true}],
            name: [{value: user.PersonalName,disabled:true}, Validators.required]            
          });
          this.myEmail=user.EmailAddress;
          this.myUsername=user.LoginUserName;
          this.myName=user.PersonalName;
        }        
      }
      this.onChanges()
    },
      error: error => 
      {console.error('There was an error!');}
    })
    
  }
  editClicked(){      
    this.detailsForm.controls['name'].enable();
    this.editMode=true;
  }
  onChanges(): void {
    
    this.detailsForm.valueChanges.subscribe(val2 => {
      console.log(val2)
      if(val2.name==this.myName){
        this.detailsForm = this.fb.group({
          emailAddress: [{value: this.myEmail,disabled:true}],
          username:[{value: this.myUsername,disabled:true}],
          name: [ {value: this.myName,disabled:this.editMode}, Validators.required]            
        });
        this.onChanges()
        console.log(this.editMode)
      }
      
    });
  }
  onCancel(){
    this.detailsForm = this.fb.group({
      emailAddress: [{value: this.myEmail,disabled:true}],
      username:[{value: this.myUsername,disabled:true}],
      name: [ {value: this.myName,disabled:this.editMode}, Validators.required]            
    });
    this.onChanges()
    this.editMode=false; 
    
  }
  onSubmit(){
    this.detailsForm.controls['name'].disable();
    this.editMode=false; 
    let update = new FormData;
    update.append('AuthToken',localStorage.getItem("AuthToken"));
    update.append('UserName',localStorage.getItem("systemUserName"));
    update.append('PersonalName', this.detailsForm.value.name)
    
    this.http.post<any>(this.globals.getApiUrl()+'api/editSPMailCompanyUser.php', update).subscribe({
      next: data => {
        console.log(data)
      },
      error: error => {
         console.error('There was an error!');
      }
    });
           
  }
  logout(){        
    let logout = new FormData;
    logout.append('AuthToken',localStorage.getItem("AuthToken"));
    logout.append('UserName',localStorage.getItem("systemUserName"));
    
    this.http.post<any>(this.globals.getApiUrl()+'api/recordSPMailUserLogOut.php', logout).subscribe({
      next: data => {
        console.log(data)
      },
      error: error => {
         console.error('There was an error!');
      }
    });
    localStorage.removeItem("userName")
    localStorage.removeItem("systemUserName")
    localStorage.removeItem("AuthTokenExpiration")
    localStorage.removeItem("AuthToken")
    this.router.navigate(['/login'])
}
openEditPassword(){
  const dialogRef = this.dialog.open(EditPasswordComponent, {
    width: '300px',
  });

  dialogRef.afterClosed().subscribe(result => {
    
  });
}

}
