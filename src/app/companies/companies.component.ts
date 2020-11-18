import { Component, OnInit } from '@angular/core';

import { Company } from '../company';
import { CompanyService } from '../company.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  companies: Company[];

  constructor(private companyService: CompanyService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(): void {
    this.companyService.getCompanies()
      .subscribe(companies => this.companies = companies);
  }

}
