import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Company } from './company';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const companies = [
      { id: 11, name: 'Big Company' },
      { id: 12, name: 'Little Company' },
      { id: 13, name: 'Round Company' },
      { id: 14, name: 'Square Company' },
      { id: 15, name: 'Triangle Company' },
      { id: 16, name: 'Super Company' },
      { id: 17, name: 'Bad Company' },
      { id: 18, name: 'Silly Company' },
      { id: 19, name: 'Great Company' },
      { id: 20, name: 'Pathetic Company' }
    ];
    return {companies};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(companies: Company[]): number {
    return companies.length > 0 ? Math.max(...companies.map(company => company.id)) + 1 : 11;
  }
}