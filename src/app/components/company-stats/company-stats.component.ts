import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-company-stats',
  templateUrl: './company-stats.component.html',
  styleUrls: ['./company-stats.component.css']
})
export class CompanyStatsComponent implements OnInit {

  constructor(private http: HttpClient, private globals: Globals, private route: ActivatedRoute) { }
  dateAccessed:Date
  recipientTotal:number
  userTotal:number
  emailSent24h:number
  emailSent7d:number
  emailSent28d:number
  emailSentTotal:number
  emailReceived24h:number
  emailReceived7d:number
  emailReceived28d:number
  emailReceivedTotal:number
  storageTotal:number
  monthlyRetailPrice:number

  ngOnInit(): void {
    let param = new HttpParams();
      param = param.append('AuthToken',this.globals.getAuthToken());
      param = param.append('UserName', this.globals.getSystemUserName());
      if(this.route.snapshot.params['id']){
        param = param.append('CompanyId',this.route.snapshot.params['id']);
      }else{
      }
      param = param.append('StartDate',"1990-10-14");
      param = param.append('EndDate',"2021-10-28");
      this.http.get<any>(this.globals.getApiUrl()+'api/getSPMailCompanyStats.php',{params:param}).subscribe({next: data => 
    {
      //Date Accessed
      this.dateAccessed = new Date(0);
      this.dateAccessed.setUTCSeconds(data.StatsList[data.StatsList.length-1].StatsDateUTC)       
      //Recipient Total
      this.recipientTotal=data.StatsList[data.StatsList.length-1].NumActiveRecipients;
      //User Total
      this.userTotal=data.StatsList[data.StatsList.length-1].NumActiveUsers;
      //Email Sent 24 Hours
      if(data.StatsList[data.StatsList.length-2]!=null){
      this.emailSent24h=data.StatsList[data.StatsList.length-1].NumEmailsSentTotal-data.StatsList[data.StatsList.length-2].NumEmailsSentTotal;}
      //Email Sent 7 Days
      if(data.StatsList[data.StatsList.length-8]!=null){
      this.emailSent7d=data.StatsList[data.StatsList.length-1].NumEmailsSentTotal-data.StatsList[data.StatsList.length-8].NumEmailsSentTotal;}
      //Email Sent 28 Days
      if(data.StatsList[data.StatsList.length-29]!=null){
      this.emailSent28d=data.StatsList[data.StatsList.length-1].NumEmailsSentTotal-data.StatsList[data.StatsList.length-29].NumEmailsSentTotal;}
      //Email Sent Total
      this.emailSentTotal=data.StatsList[data.StatsList.length-1].NumEmailsSentTotal;
      //Email Received 24 Hours
      if(data.StatsList[data.StatsList.length-2]!=null){
      this.emailReceived24h=data.StatsList[data.StatsList.length-1].NumEmailsReceivedTotal-data.StatsList[data.StatsList.length-2].NumEmailsReceivedTotal;}
      //Email Received 7 Days
      if(data.StatsList[data.StatsList.length-8]!=null){
      this.emailReceived7d=data.StatsList[data.StatsList.length-1].NumEmailsReceivedTotal-data.StatsList[data.StatsList.length-8].NumEmailsReceivedTotal;}
      //Email Received 28 Days
      if(data.StatsList[data.StatsList.length-29]!=null){
      this.emailReceived28d=data.StatsList[data.StatsList.length-1].NumEmailsReceivedTotal-data.StatsList[data.StatsList.length-29].NumEmailsReceivedTotal;}
      //Email Received Total
      this.emailReceivedTotal=data.StatsList[data.StatsList.length-1].NumEmailsReceivedTotal;      
      //Storage Total
      this.storageTotal=data.StatsList[data.StatsList.length-1].TotalStorageUsedMB/1024;
      //Monthly Retail Price
      let PriceA = 10 + 2.50 * Math.max(0, Math.floor((Number(this.recipientTotal)+24)/25)-4) + 2.50 * Math.max(0,Math.floor(Number(this.storageTotal)/10)); 
      let PriceB = 35 + 9.50 * Math.max(0, Math.floor((Number(this.recipientTotal)+124)/125)-4) + 9.50 * Math.max(0,Math.floor(Number(this.storageTotal)/50));
      let PriceC = 65 + 15 * Math.max(0, Math.floor((Number(this.recipientTotal)+249)/250)-4) + 15 * Math.max(0,Math.floor(Number(this.storageTotal)/100));
      this.monthlyRetailPrice= Math.min(PriceA,PriceB,PriceC);

    },
      error: error => 
      {console.error('There was an error!');}
    })
  }
 
}



// console.log(data)
//       for(let el of data.StatsList){
        
//       }