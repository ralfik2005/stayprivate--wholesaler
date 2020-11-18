import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Globals } from 'src/app/globals';
import { multi } from './line-data';
interface Chart {
  value: string;
  viewValue: string;
}
class ChartStats {
  name: string;
  series:{
    name:string;
    value:number;
  }[];
}
@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent implements OnInit{
  charts: Chart[] = [
    {value: 'recipientTotal', viewValue: 'Recipients'},
    {value: 'storageTotal', viewValue: 'Storage'},
    //{value: 'monthlyRetailPrice', viewValue: 'Monthly retail price'},
    {value: 'userTotal', viewValue: 'Users'},
    {value: 'emailSent24h', viewValue: 'Emails sent per day'},
    {value: 'emailSent7d', viewValue: 'Emails sent per week'},
    {value: 'emailSent28d', viewValue: 'Email sent per 28 days'},
    {value: 'emailSentTotal', viewValue: 'Cumulative emails sent'},
    {value: 'emailReceived24h', viewValue: 'Emails received per day'},
    {value: 'emailReceived7d', viewValue: 'Emails received per week'},
    {value: 'emailReceived28d', viewValue: 'Emails received per 28 days'},
    {value: 'emailReceivedTotal', viewValue: 'Cumulative emails received'}

  ];
  selectedChart = this.charts[0].value;

  multi: any;
  view: any[] = [700, 300];

  // options
  scaleMax:Number =50
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Population'; 

  colorScheme = {
    domain: [localStorage.getItem('background-color')]
  };
  constructor(private http: HttpClient, private globals:Globals, private route: ActivatedRoute) {
    //Object.assign(this, { multi });
  }


  recipientTotalChart:ChartStats={name:"Recipients",series:[{name:"",value:0}]};
  storageTotalChart:ChartStats={name:"Storage",series:[{name:"",value:0}]};
  monthlyRetailPriceChart:ChartStats={name:"Retail price",series:[{name:"",value:0}]};
  userTotalChart:ChartStats={name:"Users",series:[{name:"",value:0}]};
  emailSent24hChart:ChartStats={name:"Emails sent per day",series:[{name:"",value:0}]};
  emailSent7dChart:ChartStats={name:"Emails sent per week",series:[{name:"",value:0}]};
  emailSent28dChart:ChartStats={name:"Email sent per 28 days",series:[{name:"",value:0}]};
  emailSentTotalChart:ChartStats={name:"Total emails sent",series:[{name:"",value:0}]};
  emailReceived24hChart:ChartStats={name:"Emails received per day",series:[{name:"",value:0}]};
  emailReceived7dChart:ChartStats={name:"Emails received per week",series:[{name:"",value:0}]};
  emailReceived28dChart:ChartStats={name:"Email received per 28 days",series:[{name:"",value:0}]};
  emailReceivedTotalChart:ChartStats={name:"Total emails received",series:[{name:"",value:0}]};

  
  ngOnInit(){
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
      console.log(data)
      
      //Recipient Total
      this.recipientTotalChart.name="Recipient Total";
      for(let el of data.StatsList){
        this.recipientTotalChart.series.push({name:this.dateConverter(el.StatsDateUTC),value:Number(el.NumActiveRecipients)});
      }     
      this.recipientTotalChart.series.splice(0,1) 
      //User Total
      this.userTotalChart.name="User Total";
      for(let el of data.StatsList){
        this.userTotalChart.series.push({name:this.dateConverter(el.StatsDateUTC),value:Number(el.NumActiveUsers)});
      }     
      this.userTotalChart.series.splice(0,1) 
      //Email Sent daily
      this.emailSent24hChart.name="Emails Sent Daily";      
      for(let el of data.StatsList){
        this.emailSent24hChart.series.push({name:this.dateConverter(el.StatsDateUTC),value:Number(el.NumEmailsSentPeriod)});        
      }     
      this.emailSent24hChart.series.splice(0,1)
      //Email Sent Weekly
      data.StatsList.reverse()
      this.emailSent7dChart.name="Emails Sent Weekly";
      let i=0
      let firstEl
      for(let el of data.StatsList){
        i++        
        if(i==1){firstEl=el}
        if(i==8){
        this.emailSent7dChart.series.push({
          name:this.dateConverter(firstEl.StatsDateUTC),
          value:Number(firstEl.NumEmailsSentTotal-el.NumEmailsSentTotal)
        });
        firstEl=el;
        i=1;
        }
      }
      if(i!=0){
        if(i==1){
          this.emailSent7dChart.series.push({name:this.dateConverter(firstEl.StatsDateUTC),value:Number(firstEl.NumEmailsSentPeriod)});    
        }else{
          this.emailSent7dChart.series.push({
            name:this.dateConverter(firstEl.StatsDateUTC),
            value:Number(firstEl.NumEmailsSentTotal-data.StatsList[data.StatsList.length-1].NumEmailsSentTotal)
          });
        }        
        i=0;
      }     
      this.emailSent7dChart.series.splice(0,1) 
      this.emailSent7dChart.series.reverse()
      data.StatsList.reverse()
      //Email Sent Monthly
      data.StatsList.reverse()
      this.emailSent28dChart.name="Emails Sent Monthly"; 
      i=0;   
      firstEl=null  
      for(let el of data.StatsList){
        i++        
        if(i==1){firstEl=el}
        if(i==29){
        this.emailSent28dChart.series.push({
          name:this.dateConverter(firstEl.StatsDateUTC),
          value:Number(firstEl.NumEmailsSentTotal-el.NumEmailsSentTotal)          
        });
        firstEl=el;
        i=1;
        }
      }
      if(i!=0){
        if(i==1){
          this.emailSent28dChart.series.push({name:this.dateConverter(firstEl.StatsDateUTC),value:Number(firstEl.NumEmailsSentPeriod)});    
        }else{
          this.emailSent28dChart.series.push({
            name:this.dateConverter(firstEl.StatsDateUTC),
            value:Number(firstEl.NumEmailsSentTotal-data.StatsList[data.StatsList.length-1].NumEmailsSentTotal)
          });
        }        
        i=0;
      }     
      this.emailSent28dChart.series.splice(0,1) 
      this.emailSent28dChart.series.reverse()
      data.StatsList.reverse()
      //Email Sent Total
      this.emailSentTotalChart.name="Emails Sent Total";      
      for(let el of data.StatsList){
        this.emailSentTotalChart.series.push({name:this.dateConverter(el.StatsDateUTC),value:Number(el.NumEmailsSentTotal)});        
      } 
      //Email Received daily
      this.emailReceived24hChart.name="Emails Received Daily";      
      for(let el of data.StatsList){
        this.emailReceived24hChart.series.push({name:this.dateConverter(el.StatsDateUTC),value:Number(el.NumEmailsReceivedPeriod)});        
      }     
      this.emailReceived24hChart.series.splice(0,1)
      //Email Received Weekly
      data.StatsList.reverse()
      this.emailReceived7dChart.name="Emails Received Weekly";
      i=0
      firstEl
      for(let el of data.StatsList){
        i++        
        if(i==1){firstEl=el}
        if(i==8){
        this.emailReceived7dChart.series.push({
          name:this.dateConverter(firstEl.StatsDateUTC),
          value:Number(firstEl.NumEmailsReceivedTotal-el.NumEmailsReceivedTotal)
        });
        firstEl=el;
        i=1;
        }
      }
      if(i!=0){
        if(i==1){
          this.emailReceived7dChart.series.push({name:this.dateConverter(firstEl.StatsDateUTC),value:Number(firstEl.NumEmailsReceivedPeriod)});    
        }else{
          this.emailReceived7dChart.series.push({
            name:this.dateConverter(firstEl.StatsDateUTC),
            value:Number(firstEl.NumEmailsReceivedTotal-data.StatsList[data.StatsList.length-1].NumEmailsReceivedTotal)
          });
        }        
        i=0;
      }     
      this.emailReceived7dChart.series.splice(0,1) 
      this.emailReceived7dChart.series.reverse()
      data.StatsList.reverse()
      //Email Received Monthly
      data.StatsList.reverse()
      this.emailReceived28dChart.name="Emails Received Monthly"; 
      i=0;   
      firstEl=null  
      for(let el of data.StatsList){
        i++        
        if(i==1){firstEl=el}
        if(i==29){
        this.emailReceived28dChart.series.push({
          name:this.dateConverter(firstEl.StatsDateUTC),
          value:Number(firstEl.NumEmailsReceivedTotal-el.NumEmailsReceivedTotal)          
        });
        firstEl=el;
        i=1;
        }
      }
      if(i!=0){
        if(i==1){
          this.emailReceived28dChart.series.push({name:this.dateConverter(firstEl.StatsDateUTC),value:Number(firstEl.NumEmailsReceivedPeriod)});    
        }else{
          this.emailReceived28dChart.series.push({
            name:this.dateConverter(firstEl.StatsDateUTC),
            value:Number(firstEl.NumEmailsReceivedTotal-data.StatsList[data.StatsList.length-1].NumEmailsReceivedTotal)
          });
        }        
        i=0;
      }     
      this.emailReceived28dChart.series.splice(0,1) 
      this.emailReceived28dChart.series.reverse()
      data.StatsList.reverse()
      //Email Received Total
      this.emailReceivedTotalChart.name="Emails Received Total";      
      for(let el of data.StatsList){
        this.emailReceivedTotalChart.series.push({name:this.dateConverter(el.StatsDateUTC),value:Number(el.NumEmailsReceivedTotal)});        
      } 
      this.emailReceivedTotalChart.series.splice(0,1)
      //Total Storage
      this.storageTotalChart.name="Total Storage";      
      for(let el of data.StatsList){
        this.storageTotalChart.series.push({name:this.dateConverter(el.StatsDateUTC),value:Number(el.TotalStorageUsedMB)/1024});        
      }    
      this.storageTotalChart.series.splice(0,1)
      //MonthlyChargeValue
      this.monthlyRetailPriceChart.name="MonthlyChargeValue";      
      for(let el of data.StatsList){
        let PriceA = 10 + 2.50 * Math.max(0, Math.floor((Number(el.NumActiveRecipients)+24)/25)-4) + 2.50 * Math.max(0,Math.floor(Number(el.TotalStorageUsedMB)/10240)); 
        let PriceB = 35 + 9.50 * Math.max(0, Math.floor((Number(el.NumActiveRecipients)+124)/125)-4) + 9.50 * Math.max(0,Math.floor(Number(el.TotalStorageUsedMB)/51200));
        let PriceC = 65 + 15 * Math.max(0, Math.floor((Number(el.NumActiveRecipients)+249)/250)-4) + 15 * Math.max(0,Math.floor(Number(el.TotalStorageUsedMB)/102400));
        let monthlyRetailPrice= Math.min(PriceA,PriceB,PriceC);
        this.monthlyRetailPriceChart.series.push({name:this.dateConverter(el.StatsDateUTC),value:Number(monthlyRetailPrice)});        
      }    
      this.monthlyRetailPriceChart.series.splice(0,1) 
      
      this.onSwitch();
    },
      error: error => 
      {console.error('There was an error!');}
    })
    
  }

  dateConverter(unixTimestamp):string{
    var a = new Date(unixTimestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + ' ' + month + ' ' + year;
    return time;
  }
  

  onSwitch(){
    switch (this.selectedChart) {
      case 'recipientTotal':
          this.yAxisLabel = 'Recipients';          
          this.multi=JSON.parse(JSON.stringify(this.recipientTotalChart).replace(/^\{(.*)\}$/,"[ { $1 }]"));
          for(let el of this.recipientTotalChart.series)
          if(el.value<10){
            this.scaleMax=10
          }else{this.scaleMax=null;break;}
          break;
      case 'userTotal':
          this.yAxisLabel = 'Users';
          this.multi=JSON.parse(JSON.stringify(this.userTotalChart).replace(/^\{(.*)\}$/,"[ { $1 }]"));
          for(let el of this.userTotalChart.series)
          if(el.value<10){
            this.scaleMax=10
          }else{this.scaleMax=null;break;}
          break;
      case 'emailSent24h':
        this.yAxisLabel = 'Emails sent per day';
          this.multi=JSON.parse(JSON.stringify(this.emailSent24hChart).replace(/^\{(.*)\}$/,"[ { $1 }]"));
          for(let el of this.emailSent24hChart.series)
          if(el.value<10){
            this.scaleMax=10
          }else{this.scaleMax=null;break;}
          console.log(this.multi)
          break;
          break;
      case 'emailSent7d':
          this.yAxisLabel = 'Email sent per week';
          this.multi=JSON.parse(JSON.stringify(this.emailSent7dChart).replace(/^\{(.*)\}$/,"[ { $1 }]"));
          for(let el of this.emailSent7dChart.series)
          if(el.value<10){
            this.scaleMax=10
          }else{this.scaleMax=null;break;}
          console.log(this.multi)
          break;
      case 'emailSent28d':
          this.yAxisLabel = 'Email sent per 28 days';
          this.multi=JSON.parse(JSON.stringify(this.emailSent28dChart).replace(/^\{(.*)\}$/,"[ { $1 }]"));
          for(let el of this.emailSent28dChart.series)
          if(el.value<10){
            this.scaleMax=10
          }else{this.scaleMax=null; break;}
          console.log(this.multi)
          break;
      case 'emailSentTotal':
          this.yAxisLabel = 'Total emails sent';
          this.multi=JSON.parse(JSON.stringify(this.emailSentTotalChart).replace(/^\{(.*)\}$/,"[ { $1 }]"));
          for(let el of this.emailSentTotalChart.series)
          if(el.value<10){
            this.scaleMax=10
          }else{this.scaleMax=null;break;}
          console.log(this.multi)
          break;     
      case 'emailReceived24h':
          this.yAxisLabel = 'Emails received per day';
          this.multi=JSON.parse(JSON.stringify(this.emailReceived24hChart).replace(/^\{(.*)\}$/,"[ { $1 }]"));
          for(let el of this.emailReceived24hChart.series)
          if(el.value<10){
            this.scaleMax=10
          }else{this.scaleMax=null;break;}
          console.log(this.multi)
          break;  
      case 'emailReceived7d':
          this.yAxisLabel = 'Emails received per week';
          this.multi=JSON.parse(JSON.stringify(this.emailReceived7dChart).replace(/^\{(.*)\}$/,"[ { $1 }]"));
          for(let el of this.emailReceived7dChart.series)
          if(el.value<10){
            this.scaleMax=10
          }else{this.scaleMax=null;break;}
          console.log(this.multi)
          break;  
      case 'emailReceived28d':
          this.yAxisLabel = 'Email received per 28 days';
          this.multi=JSON.parse(JSON.stringify(this.emailReceived28dChart).replace(/^\{(.*)\}$/,"[ { $1 }]"));
          for(let el of this.emailReceived28dChart.series)
          if(el.value<10){
            this.scaleMax=10
          }else{this.scaleMax=null;break;}
          console.log(this.multi)
          break;    
      case 'emailReceivedTotal':
          this.yAxisLabel = 'Total emails received';
          this.multi=JSON.parse(JSON.stringify(this.emailReceivedTotalChart).replace(/^\{(.*)\}$/,"[ { $1 }]"));
          for(let el of this.emailReceivedTotalChart.series)
          if(el.value<10){
            this.scaleMax=10
          }else{this.scaleMax=null;break;}
          console.log(this.multi)
          break;
      case 'storageTotal':
          this.yAxisLabel = 'Storage (GB)';
          this.multi=JSON.parse(JSON.stringify(this.storageTotalChart).replace(/^\{(.*)\}$/,"[ { $1 }]"));
          for(let el of this.storageTotalChart.series)
          if(el.value<9){
            this.scaleMax=9
          }else{this.scaleMax=null;break;}
          console.log(this.multi)
          break;
      case 'monthlyRetailPrice':
          this.yAxisLabel = 'Retail price';
          this.multi=JSON.parse(JSON.stringify(this.monthlyRetailPriceChart).replace(/^\{(.*)\}$/,"[ { $1 }]"));
          for(let el of this.monthlyRetailPriceChart.series)
          if(el.value<10){
            this.scaleMax=10
          }else{this.scaleMax=null;break;}
          console.log(this.multi)
          break;
      default:
          break;
  }
  }

}
