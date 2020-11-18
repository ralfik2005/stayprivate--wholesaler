import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { Company } from './company';
import { COMPANIES } from './mock-companies';

import { MessageService } from './message.service';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CompanyService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private companiesUrl = 'api/companies';  // URL to web api

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.companiesUrl)
      .pipe(
        tap(_ => this.log('fetched companies')),
        catchError(this.handleError<Company[]>('getCompanies', []))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getCompany(id: number): Observable<Company> {
    const url = `${this.companiesUrl}/${id}`;
    return this.http.get<Company>(url).pipe(
      tap(_ => this.log(`fetched company id=${id}`)),
      catchError(this.handleError<Company>(`getCompany id=${id}`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`CompanyService: ${message}`);
  }

}
