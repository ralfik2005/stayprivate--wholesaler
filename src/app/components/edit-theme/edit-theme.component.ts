import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-edit-theme',
  templateUrl: './edit-theme.component.html',
  styleUrls: ['./edit-theme.component.css']
})
export class EditThemeComponent implements OnInit {

  constructor(private fb: FormBuilder,private breakpointObserver: BreakpointObserver,private globals:Globals, private http:HttpClient,private _snackBar: MatSnackBar,private router: Router) { }
  // @Input() background =localStorage.getItem('background-color');
  // @Input() foreground =localStorage.getItem('foreground-color')
  // @Input() highlight =localStorage.getItem('highlight-color')
  // @Input() border =localStorage.getItem('border-color')
  appName =localStorage.getItem('app-name')
  mode = new FormControl('side');
  start : string;
  img: string;
  myCompanyType=this.globals.getCompanyType();
  myCompanyId= this.globals.getCompanyId();
  themeForm = this.fb.group({
    background: [localStorage.getItem('background-color')],
    foreground: [localStorage.getItem('foreground-color')],
    highlight: [localStorage.getItem('highlight-color')],
    border: [localStorage.getItem('border-color')],
    name : [localStorage.getItem('app-name')],
    
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
     if(localStorage.getItem("img-url")!=null){
      this.img=(this.globals.getImgUrl()+localStorage.getItem("img-url")+"logo-small.png?t="+new Date().getTime())
    }else{this.img="/assets/images/SP_Logo_Icon+Text_Blue.svg"}
   
  }
  onFileChange(evt): void {
    let imageForm = new FormData;    
    imageForm.append('AuthToken',this.globals.getAuthToken());
    imageForm.append('UserName',this.globals.getSystemUserName());
    imageForm.append('LogoType',"S");
    imageForm.append('UploadFileInd',evt.target.files[0]);
    this.http.post<any>(this.globals.getApiUrl()+'api/uploadSPMailCompanyLogo.php', imageForm).subscribe({
      next: data => { 
        
        this.getLogo()    
      },
      error: error => {
        this._snackBar.open(error.error.ErrorMsg,"OK",{duration:5000} );
      }
    });
  }
  getLogo(){
    let param = new HttpParams();
    param = param.append('AuthToken',this.globals.getAuthToken());
    param = param.append('UserName', this.globals.getSystemUserName());
    
    this.http.get<any>(this.globals.getApiUrl()+'api/getSPMailCompanyTheme.php', {params:param}).subscribe({
      next: themedata => {        
      localStorage.setItem('img-url', themedata.logo);
      this.img=(this.globals.getImgUrl()+localStorage.getItem("img-url")+"SP_Logo_Icon+Text_Blue.svg?t="+new Date().getTime())       
      },
      error: error => {
         console.error('There was an error!');
      }
    });
  }
  onSubmit(){
    localStorage.setItem('background-color', this.themeForm.value.background);
    localStorage.setItem('foreground-color', this.themeForm.value.foreground);
    localStorage.setItem('highlight-color', this.themeForm.value.highlight);
    localStorage.setItem('border-color', this.themeForm.value.border);
    localStorage.setItem('app-name', this.themeForm.value.name);
    let form = new FormData;    
    form.append('AuthToken',this.globals.getAuthToken());
    form.append('UserName',this.globals.getSystemUserName());
    form.append('background-color',this.themeForm.value.background);
    form.append('foreground-color ',this.themeForm.value.foreground);
    form.append('highlight-color',this.themeForm.value.highlight);
    form.append('border-color',this.themeForm.value.border);       
    form.append('app-name',this.themeForm.value.name)
    this.themeForm.markAsPristine();

    this.http.post<any>(this.globals.getApiUrl()+'api/editSPMailCompanyTheme.php', form).subscribe({
      next: data => {
        console.log(data)
        
        document.head.insertAdjacentHTML("beforeend","<style>.sp-background{background-color:"+localStorage.getItem('background-color')+"!important}</style>")
        document.head.insertAdjacentHTML("beforeend","<style>.sp-title{color:"+localStorage.getItem('foreground-color')+"!important}</style>" );
        document.head.insertAdjacentHTML("beforeend","<style>.sp-sidenav{color:"+localStorage.getItem('highlight-color')+"!important}</style>" );
        document.head.insertAdjacentHTML("beforeend","<style>.sp-topnav{color:"+localStorage.getItem('border-color')+"!important}</style>" );
     
      },
      error: error => {
         console.error('There was an error!');
      }
    });
    console.log(this.img)
  }
  onClear(){
    this.themeForm=this.fb.group({
      background: [localStorage.getItem('background-color')],
      foreground: [localStorage.getItem('foreground-color')],
      highlight: [localStorage.getItem('highlight-color')],
      border: [localStorage.getItem('border-color')],
      name: [localStorage.getItem('app-name')],
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
