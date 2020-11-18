import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Globals } from 'src/app/globals';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CompanyCheckerComponent } from '../company-checker/company-checker.component';
interface SelectorType {
  value: string;
  viewValue: string;
  flag?:string;
}

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})


export class AddCompanyComponent implements OnInit {

  constructor(
    private fb: FormBuilder, 
    private globals: Globals,
    private http: HttpClient, 
    private breakpointObserver: BreakpointObserver, 
    private router: Router,
    public dialog: MatDialog
  ) {}
  
  myCompanyType=this.globals.getCompanyType();
  appName =localStorage.getItem('app-name')
  
  companyTypes: SelectorType[] = [
    //{value: 'S', viewValue: 'Super', flag: 'N'},
    {value: 'W', viewValue: 'Wholesaler', flag: 'N'},
    //{value: 'W', viewValue: 'Dealer', flag: 'Y'},
    {value: 'R', viewValue: 'Reseller', flag: 'Y'},
    {value: 'C', viewValue: 'Client', flag: 'N'},
  ];
  selectedType
  
  initialTiers: SelectorType[] = [
    {value: '100', viewValue: '100 Recipients'},
    {value: '500', viewValue: '500 Recipients'},
    {value: '1000', viewValue: '1,000 Recipients'},
    {value: '99999', viewValue: 'Unlimited'},
    {value: '0', viewValue: 'Not applicable'}
  ];

  mode = new FormControl('side');
  start : string;
  myCompanyId= this.globals.getCompanyId();
  

  addCompanyForm = this.fb.group({
    CompanyIdent: [null, Validators.required],
    CompanyName: [null, Validators.required],
    CompanyType: [null, Validators.required],
    CompanyAddress: [null],
    CompanyTelNo: [null],
    CompanyVatNo: [null],
    InitialTier: [null,Validators.required],
    ContactName: [null],
    ContactEmail: [null],
    ContactTelNo: [null],
    'DomainList': new FormArray([]),
    SetUpUserEmail: [null]
  });

  onSubmit() { 

    if(this.addCompanyForm.valid) {
      const dialogRef = this.dialog.open(CompanyCheckerComponent, {
        width: '300px',
        data: {company: this.addCompanyForm}
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
        if(result==true){
          console.log("result true")
          console.log(this.addCompanyForm.value.DomainList)
          this.addCompanyForm.value.DomainList=this.addCompanyForm.value.DomainList.filter(val => val).join(';');
          this.addCompany(this.addCompanyForm.value);
        }
        if(result==false){
          console.log("result false")
          this.addCompanyForm.value.DomainList="";
          this.addCompany(this.addCompanyForm.value);
        }
        
      });
      
    } else {
    }
    
  }
  addCompany(formData){
        let form = new FormData;
    
    
    form.append('AuthToken',this.globals.getAuthToken());
    form.append('UserName',this.globals.getSystemUserName());
    form.append('CompanyIdent',formData.CompanyIdent);
    form.append('CompanyName',formData.CompanyName);
    if(formData.CompanyType==='Super'){
      form.append('SPMCompanyType','S');
      form.append('IsDealerFlag','N');
    }else if(formData.CompanyType==='Wholesaler'){
      form.append('SPMCompanyType','W');
      form.append('IsDealerFlag','N');
    }else if(formData.CompanyType==='Dealer'){
      form.append('SPMCompanyType','W');
      form.append('IsDealerFlag','Y');
    }else if(formData.CompanyType==='Reseller'){
      form.append('SPMCompanyType','R');
      form.append('IsDealerFlag','Y');
    }else if(formData.CompanyType==='Client'){
      form.append('SPMCompanyType','C');
      form.append('IsDealerFlag','N');
    }
    if(formData.CompanyAddress!=null){form.append('CompanyAddress',formData.CompanyAddress);}
    if(formData.CompanyTelNo!=null){form.append('CompanyTelNo',formData.CompanyTelNo);}
    if(formData.CompanyVatNo!=null){form.append('CompanyVatNo',formData.CompanyVatNo);}
    if(formData.InitialTier!=null){form.append('InitialTier',formData.InitialTier);}
    if(formData.ContactName!=null){form.append('ContactName',formData.ContactName);}
    if(formData.ContactEmail!=null){form.append('ContactEmail',formData.ContactEmail);}
    if(formData.ContactTelNo!=null){form.append('ContactTelNo',formData.ContactTelNo);}
    if(formData.DomainList!=""){form.append('DomainList',formData.DomainList);}
    if(formData.SetUpUserEmail!=null){form.append('SetUpUserEmail',formData.SetUpUserEmail);}

    this.http.post<any>(this.globals.getApiUrl()+'api/addSPMailCompany.php', form).subscribe({
      next: data => {
        console.log(data)
      },
      error: error => {
         console.error('There was an error!');
      }
    });
  }

  getControls() {
    return (<FormArray>this.addCompanyForm.get('DomainList')).controls;
  }
  addNewItem(){
    const control = new FormControl(null, [Validators.pattern('^(?!.* .*)(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$')]);
    (<FormArray>this.addCompanyForm.get('DomainList')).push(control)
  }
  deleteNewItem(index){
    (<FormArray>this.addCompanyForm.get('DomainList')).removeAt(index);
  }

  ngOnInit(): void {
    this.globals.refreshAuth();
    this.globals.checkTheme();
    this.addNewItem()

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
      if(this.myCompanyType=="Reseller"){
        this.addCompanyForm.controls['CompanyType'].setValue("C");
        this.addCompanyForm.controls['CompanyType'].disable();
      }
      
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
