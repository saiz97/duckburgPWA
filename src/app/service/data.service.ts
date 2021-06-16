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

  getItemById(id: number) {
    return this.http.get(`${this.BASE_URL}/itemById`, { headers: new HttpHeaders(), params: { 'id': id.toString() } })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllComics(params: { [index: string]: string } = {}): Observable<any> {
    return this.http.get(`${this.BASE_URL}/comics`, { headers: new HttpHeaders(), params: params })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getComicFilterData() {
    return this.http.get(`${this.BASE_URL}/comics/filters`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllFigures(params: { [index: string]: string } = {}): Observable<any> {
    return this.http.get(`${this.BASE_URL}/figures`, { headers: new HttpHeaders(), params: params })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getFigureFilterData() {
    return this.http.get(`${this.BASE_URL}/figures/filters`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllClothes(params: { [index: string]: string } = {}): Observable<any> {
    return this.http.get(`${this.BASE_URL}/clothes`, { headers: new HttpHeaders(), params: params })
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getClothesFilterData() {
    return this.http.get(`${this.BASE_URL}/clothes/filters`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: Error | any): Observable<any> {
    return throwError(error);
  }
}
