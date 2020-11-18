import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Globals } from 'src/app/globals';
import { AddUserComponent } from '../add-user/add-user.component';

export interface DialogData {
  emailAddress: string;
  name: string;
}


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private http: HttpClient, private globals: Globals,private route:ActivatedRoute,public dialog: MatDialog) { }
  companyDomain:boolean = false
  users;
  emailAddress: string;
  name: string;
  displayedColumns: string[] = ['LoginUserName', 'PersonalName', 'EmailAddress'];
  dataSource
  ngOnInit(): void {
    
    let param = new HttpParams();
      param = param.append('AuthToken',this.globals.getAuthToken());
      param = param.append('UserName', this.globals.getSystemUserName());
      if(this.route.snapshot.params['id']){
        param = param.append('CompanyId',this.route.snapshot.params['id']);
      }else{
      }
      
      this.http.get<any>(this.globals.getApiUrl()+'api/getSPMailCompanyUsers.php',{params:param}).subscribe({next: data => 
    {
      this.users=data.UserList
      this.dataSource = this.users; 
    },
      error: error => 
      {console.error('There was an error!');}
    })
    this.http.get<any>(this.globals.getApiUrl()+'api/getSPMailCompanyInfo.php', {params:param}).subscribe({next: data => 
    {
      if(data.DomainList==""){this.companyDomain=false}
      else{this.companyDomain=true}
    },
    error: error => 
      {console.error('There was an error!');}
    });
  }
  openAddUser(){
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '300px',
      data: {route: this.route}
    });

    dialogRef.afterClosed().subscribe(result => {
      let param = new HttpParams();
      param = param.append('AuthToken',this.globals.getAuthToken());
      param = param.append('UserName', this.globals.getSystemUserName());
      param = param.append('CompanyId',this.route.snapshot.params['id']);
      this.http.get<any>(this.globals.getApiUrl()+'api/getSPMailCompanyUsers.php',{params:param}).subscribe({next: data => 
    {
      this.users=data.UserList
      console.log(this.users);
        
    },
      error: error => 
      {console.error('There was an error!');}
    })
    });
  }
}

