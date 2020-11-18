import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Globals } from 'src/app/globals';
import { AddCompanyComponent } from '../add-company/add-company.component';

class Record{name:string; spfBool:boolean ;dkimBool:boolean;spfError:string;dkimError:string;dkimLoading:boolean;spfLoading:boolean};

@Component({
  selector: 'app-company-checker',
  templateUrl: './company-checker.component.html',
  styleUrls: ['./company-checker.component.css']
})
export class CompanyCheckerComponent implements OnInit {
  records:Record[]
  constructor(
    private http: HttpClient,
    private globals:Globals, 
    public dialogRef: MatDialogRef<AddCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {company: FormGroup}
  ) {
    for(let el of this.data.company.value.DomainList ){
      if(el!=null&&el!=""){
      let temp:Record={name:el,spfBool:null,dkimBool:null,spfError:null,dkimError:null,dkimLoading:true,spfLoading:true}
      if(this.records==null){
        this.records=[temp];
      }else{
        this.records.push(temp)
      }      
    }
    }
  }  
  valid:boolean=false;
  message:string;
  ngOnInit(): void {
    if(this.records!=null){
      this.spfChecker();
      this.dkimChecker();
      this.loadChecker();
    }
    else{this.message="Atleast 1 domain is required if you wish to use a system"
      if(this.data.company.value.CompanyType=="Client"){this.valid=false;}else{this.valid=true;}
    }
  }
  onNoClick(){this.dialogRef.close();}
  onSubmit(){
    if(this.records!=null){
      for ( var i = 0; i < this.records.length; i++) {
        let record=this.records[i]
        console.log("checking")
        if(record.spfBool==false||record.dkimBool==false){
          console.log("uhoh")
          this.dialogRef.close(false);
          break;
        }else{
          if(record==this.records[this.records.length-1]){
            this.dialogRef.close(true);
          }
          
        } 
      }      
    }
    else{
      this.dialogRef.close(false);
    }
  }
  loadChecker(){
    this.valid=false;
    for(let record of this.records){
    if(record.dkimLoading==false&&record.spfLoading==false){
      if(record.spfBool==false||record.dkimBool==false){
        console.log(this.data.company.value.CompanyType)
        if(this.data.company.value.CompanyType=="Client"){
          this.message="Something didn't work there. Please try again"
          this.valid=false; 
          break;
        }
        else{
          this.message="Domains must all be valid if you wish to use a system"
          this.valid=true;
        }
      }else{
        this.valid=true;
      }
      
      
    }
  }}
  spfChecker(){
    for(let el of this.data.company.value.DomainList){       
      let domain = new FormData;
        domain.append('domain',el);
        this.http.post<any>("https://wholesaler--api.herokuapp.com/spfCheck",domain).subscribe({
          next: data => {
            for(let record of this.records){
              if(record.name==el){
                console.log(record)
                record.spfBool=true;
                record.spfLoading=false;
                this.loadChecker();
              }
            }                 
          },
          error: error => {
            for(let record of this.records){
              if(record.name==el){
                console.log(record)
                record.spfBool=false;
                record.spfLoading=false;
                this.loadChecker();
              }
            }        
          }
        });
      
    }
  }
  dkimChecker(){
    for(let el of this.data.company.value.DomainList){ 
      let domain = new FormData;
      domain.append('domain',el);
      this.http.post<any>("http://localhost:3000/dkimCheck",domain).subscribe({
        next: data => {
          for(let record of this.records){
            if(record.name==el){
              record.dkimBool=true;
              record.dkimLoading=false;
              this.loadChecker();
            }
          } 
        },
        error: error => {
          for(let record of this.records){
            if(record.name==el){
              record.dkimBool=false;
              record.dkimError=error.error.ErrorMsg
              record.dkimLoading=false;
              this.loadChecker();
            }
          }  
        }
      });
      
    }
}
}
