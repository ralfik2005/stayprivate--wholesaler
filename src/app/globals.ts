import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class Globals{

  private productionMode=false;

  defaultUsername;
  defaultUserPwd;
  private companyId: string;
  private ApiUrl:string;
  private ImgUrl:string;
  private companyType:string;
  
  start(){
    if(this.productionMode==true){
      this.ApiUrl="https://app.stayprivatemail.com/ao_ws/"
      this.ImgUrl="https://app.stayprivatemail.com"
      this.defaultUsername = null;
      this.defaultUserPwd = null;
      this.companyId = null;
    }else{
      this.defaultUsername = "spmsupertest1";
      this.defaultUserPwd = "%SPM%Test%Usr1";
      this.companyId = "543";
      this.ApiUrl="https://www.econumysecure.com/ao_ws/"
      this.ImgUrl="https://www.econumysecure.com"
    
    }
  }
  //Set value to null when not testing
  
  getApiUrl(){
    return this.ApiUrl;
  }
  getImgUrl(){
    return this.ImgUrl;
  }
  getUserName(){
    return localStorage.getItem("userName");
  }
  setUserName(userInput:string){    
    localStorage.setItem("userName",userInput)    
  }
  getCompanyType(){
    return localStorage.getItem("companyType");
  }
  setCompanyType(userInput:string){    
    localStorage.setItem("companyType",userInput)
  }

  getSystemUserName(){
    return localStorage.getItem("systemUserName");
  }
  setSystemUserName(userInput:string){
    localStorage.setItem("systemUserName",userInput)
  }
  refreshAuth(){
    localStorage.setItem("AuthTokenExpiration",JSON.stringify(new Date(new Date().getTime() + (60000*30))))
  }
  checkTheme(){
    if(localStorage.getItem("background-color")!=null){document.head.insertAdjacentHTML("beforeend",
    "<style>  .sp-background{background-color:"+localStorage.getItem('background-color')+"!important} "
    +".mat-ink-bar{background-color:"+localStorage.getItem('background-color')+"!important}" 
    +".mat-option.mat-selected{color:"+localStorage.getItem('background-color')+"!important}"
    +".mat-icon-button{color:"+localStorage.getItem('background-color')+"!important}"
    +".mat-form-field-ripple{background-color:"+localStorage.getItem('background-color')+"!important}</style>" );}
    

    if(localStorage.getItem("foreground-color")!=null){document.head.insertAdjacentHTML("beforeend","<style>.sp-title{color:"+localStorage.getItem('foreground-color')+"!important}</style>" );}
    if(localStorage.getItem("highlight-color")!=null){document.head.insertAdjacentHTML("beforeend","<style>.sp-sidenav{color:"+localStorage.getItem('highlight-color')+"!important}</style>" );}
    if(localStorage.getItem("border-color")!=null){document.head.insertAdjacentHTML("beforeend","<style>.sp-topnav{color:"+localStorage.getItem('border-color')+"!important}</style>" );}
  }
  getAuthToken(){
    if(!localStorage.getItem("AuthTokenExpiration")|| new Date()>new Date(JSON.parse(localStorage.getItem("AuthTokenExpiration")))){
      localStorage.removeItem("userName")
      localStorage.removeItem("systemUserName")
      localStorage.removeItem("AuthTokenExpiration")
      localStorage.removeItem("AuthToken")
      return null;
    }
    return localStorage.getItem("AuthToken");
  }
  setAuthToken(userInput:string){
    
    localStorage.setItem("AuthToken",userInput)
    localStorage.setItem("AuthTokenExpiration",JSON.stringify(new Date(new Date().getTime() + (60000*30))))
  }

  getCompanyId(){
    return this.companyId;
  }
  
}