import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/company.model';
import { Globals } from 'src/app/globals';
import { CompanyCheckerComponent } from '../company-checker/company-checker.component';
interface SelectorType {
  value: string;
  viewValue: string;
  flag?:string;
}
@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {
  
  constructor(
    private globals: Globals, 
    private fb: FormBuilder, 
    private http: HttpClient, 
    private breakpointObserver: BreakpointObserver, 
    private route: ActivatedRoute, 
    private router: Router,
    public dialog: MatDialog
  ) { }
  
  appName =localStorage.getItem('app-name')
  company: Company;
  companytype:string;
  editMode=false;
  mode = new FormControl('side');
  start : string;
  companyID =this.route.snapshot.params['id'];
  companyIdentTitle;
  myCompanyId= this.globals.getCompanyId();
  myCompanyType=this.globals.getCompanyType();
  
  

  companyTypes: SelectorType[] = [
    {value: 'S', viewValue: 'Super', flag: 'N'},
    {value: 'W', viewValue: 'Wholesaler', flag: 'N'},
    {value: 'W', viewValue: 'Dealer', flag: 'Y'},
    {value: 'R', viewValue: 'Reseller', flag: 'Y'},
    {value: 'C', viewValue: 'Client', flag: 'N'},
  ];
  initialTiers: SelectorType[] = [
    {value: '0', viewValue: 'Not applicable'},
    {value: '100', viewValue: '100 Recipients'},
    {value: '500', viewValue: '500 Recipients'},
    {value: '1000', viewValue: '1,000 Recipients'},
    {value: '99999', viewValue: 'Unlimited'}
  ];
  addCompanyForm = this.fb.group({
    CompanyIdent: [null, Validators.required],
    CompanyName: [null, Validators.required],
    CompanyType: [null, Validators.required],
    CompanyAddress: [null],
    CompanyTelNo: [null],
    CompanyVatNo: [null],
    InitialTier: [null],
    ContactName: [null],
    ContactEmail: [null],
    ContactTelNo: [null],
    'DomainList': new FormArray([]),
    SetUpUserEmail: [null],
  });

  ngOnInit(): void {
    this.globals.refreshAuth();
    this.globals.checkTheme();
    this.company= {Name:"",Id:"",CompanyId:"",CompanyIdent:"",CompanyName:"",ParentCompanyId:"",IsDealerFlag:"",SPMCompanyType:""}
        
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
        param = param =param.append('AuthToken',this.globals.getAuthToken());
        param = param.append('UserName', this.globals.getSystemUserName());
        param = param.append('CompanyId',this.companyID);
        this.http.get<Company>(this.globals.getApiUrl()+'api/getSPMailCompanyInfo.php', {params:param}).subscribe({next: data => 
      {this.company=data
      
      if (this.company.SPMCompanyType=="S"){this.companytype="Super"}
      if (this.company.SPMCompanyType=="W"&&this.company.IsDealerFlag=="N"){this.companytype="Wholesaler"}
      if (this.company.SPMCompanyType=="W"&&this.company.IsDealerFlag=="Y"){this.companytype="Dealer"}
      if (this.company.SPMCompanyType=="R"){this.companytype="Reseller"}
      if (this.company.SPMCompanyType=="C"){this.companytype="Client"}

      for(let domain of this.company.DomainList){
        this.addDomains(domain)
      }
      this.update();
      if (this.editMode){this.addCompanyForm.enable();}
      else{this.addCompanyForm.disable();}
      
      this.companyIdentTitle = this.company.CompanyIdent

    },
      error: error => 
      {console.error('There was an error!');}
    });
    if (this.editMode){this.addCompanyForm.enable();}
    else{this.addCompanyForm.disable();}
  }
  editClicked(){
    this.editMode=!this.editMode;
    this.addNewItem();
    this.addCompanyForm.enable();
      this.addCompanyForm.controls['CompanyIdent'].disable();      
      this.addCompanyForm.controls['CompanyType'].disable();
      this.addCompanyForm.controls['InitialTier'].disable();
  }
  update(){
    this.addCompanyForm = this.fb.group({
      CompanyIdent: [{value:this.company.CompanyIdent,disabled:this.editMode}, Validators.required],
      CompanyName: [{value:this.company.CompanyName,disabled:this.editMode}, Validators.required],
      CompanyType: [{value:this.companytype,disabled:this.editMode}, Validators.required],
      CompanyAddress: [{value:this.company.CompanyAddress,disabled:this.editMode}],
      CompanyTelNo: [{value:this.company.CompanyTelNo,disabled:this.editMode}],
      CompanyVatNo: [{value:this.company.CompanyVatNo,disabled:this.editMode}],
      InitialTier: [{value:this.company.InitialTier,disabled:this.editMode}],
      ContactName: [{value:this.company.ContactName,disabled:this.editMode}],
      ContactEmail: [{value:this.company.ContactEmail,disabled:this.editMode}],
      ContactTelNo: [{value:this.company.ContactTelNo,disabled:this.editMode}],
      'DomainList': this.addCompanyForm.get('DomainList')
    });
  }
  getControls() {
    return (<FormArray>this.addCompanyForm.get('DomainList')).controls;
  }
  addNewItem(){
    const control = new FormControl(null, Validators.pattern('^(?!.* .*)(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$'));
    (<FormArray>this.addCompanyForm.get('DomainList')).push(control)
  }
  addDomains(domain){
    const control = new FormControl(domain, Validators.pattern('^(?!.* .*)(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$'));
    (<FormArray>this.addCompanyForm.get('DomainList')).push(control)
  }
  deleteNewItem(index){
    (<FormArray>this.addCompanyForm.get('DomainList')).removeAt(index);
  }


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
    form.append('CompanyId',this.companyID);
    form.append('CompanyName',formData.CompanyName);
    if(formData.CompanyAddress!=null){form.append('CompanyAddress',formData.CompanyAddress);}
    if(formData.CompanyTelNo!=null){form.append('CompanyTelNo',formData.CompanyTelNo);}
    if(formData.CompanyVatNo!=null){form.append('CompanyVatNo',formData.CompanyVatNo);}
    if(formData.InitialTier!=null){form.append('InitialTier',formData.InitialTier);}
    if(formData.ContactName!=null){form.append('ContactName',formData.ContactName);}
    if(formData.ContactEmail!=null){form.append('ContactEmail',formData.ContactEmail);}
    if(formData.ContactTelNo!=null){form.append('ContactTelNo',formData.ContactTelNo);}
    if(formData.DomainList!=""){form.append('DomainList',formData.DomainList);}

    this.http.post<any>(this.globals.getApiUrl()+'api/editSPMailCompany.php', form).subscribe({
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
  onCancel(){
    
    this.addCompanyForm.reset();
    this.update();
    let domains=this.company.DomainList
    for(let domain of this.addCompanyForm.value.DomainList){
      this.deleteNewItem(0)
      console.log(domain)
    }
    (<FormArray>this.addCompanyForm.get('DomainList'));
    this.company.DomainList = domains;
    for(let domain of this.company.DomainList){
      this.addDomains(domain)
      console.log(domain)
    }
    this.addCompanyForm.disable();
    this.editMode=false;
  }
}
