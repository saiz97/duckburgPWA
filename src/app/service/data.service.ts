import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private BASE_URL: string = "https://api.s1810456031.student.kwmhgb.at/wp-json/duckburg";

  isLoading = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  getAllComics(params: { [index: string]: any } = {}): Observable<any> {
    return this.http.get(`${this.BASE_URL}/comics`, { headers: new HttpHeaders(), params: this.handleParameters(params) })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllFigures(params: { [index: string]: any } = {}): Observable<any> {
    return this.http.get(`${this.BASE_URL}/figures`, { headers: new HttpHeaders(), params: this.handleParameters(params) })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllClothes(params: { [index: string]: any } = {}): Observable<any> {
    return this.http.get(`${this.BASE_URL}/clothes`, { headers: new HttpHeaders(), params: this.handleParameters(params) })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  private handleParameters(params: { [index: string]: any } = {}) : HttpParams {
    const parameters = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      parameters.set(key, value);
    });
    return parameters;
  }

  private errorHandler(error: Error | any): Observable<any> {
    return throwError(error);
  }
}
