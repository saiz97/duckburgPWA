import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private dataService: DataService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.dataService.isLoading.next(true);
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': (sessionStorage.getItem('token')) ?  `Bearer ${sessionStorage.getItem('token')}` : ''
      }
    })

    return next.handle(request);
  }
}
