import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Globals } from 'src/app/globals';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(private globals:Globals,private http:HttpClient, private breakpointObserver: BreakpointObserver,private router:Router) {}
  appName =localStorage.getItem('app-name')
  myCompanyType=this.globals.getCompanyType();
  myCompanyId= this.globals.getCompanyId();
  mode = new FormControl('side');
  start : string;

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
}
