import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { User } from './user';

export interface Response {
  access_token: string;
}

interface Token {
  exp: number;
  data: {
    user: {
      id: number
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL: string = "https://api.s1810456031.student.kwmhgb.at/wp-json/wp/v2/users";
  private BASE_URL_TOKEN: string = "https://api.s1810456031.student.kwmhgb.at/wp-json/jwt-auth/v1/token";

  adminStatus: boolean = false;
  loginStatus = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }

  login (username: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE_URL_TOKEN}`, {}, {
      headers: new HttpHeaders(),
      params: {
        'username': username,
        'password': password
      }}).pipe(catchError(this.errorHandler));
  }

  signup (username: string, email: string, password: string) {
    return this.http.post(`${this.BASE_URL}/register`, {
      'username': username,
      'email': email,
      'password': password,
      'role': "author"
    }).pipe(catchError(this.errorHandler));
  }

  getCurrentUser(): User {
    if (this.isLoggedIn()) {
      const storageUser: any = JSON.parse(sessionStorage.getItem("user"));
      return new User(storageUser.id, storageUser.user_email, storageUser.user_nicename, storageUser.user_display_name);
    } else {
      return null;
    }
  }

  setSessionStorage(token: string, user: User) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  decodeTokenForId(token: string): number {
    return +(jwt_decode(token) as Token).data.user.id;
  }

  logout() {
    sessionStorage.clear();
    console.log("logged out");
    this.loginStatus.next(false);
  }

  isLoggedIn() {
    if (sessionStorage.getItem("token") && sessionStorage.getItem("user")) {
      let token: string = sessionStorage.getItem("token");
      const decodedToken = jwt_decode(token) as Token;
      let expirationDate: Date = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);

      if (expirationDate < new Date()) {
        console.log("token expired");
        this.logout();
        return false;
      } else {
        this.loginStatus.next(true);
        return true
      }
    } else {
      this.logout();
      return false;
    }
  }

  private errorHandler(error: Error | any): Observable<any> {
    return throwError(error);
  }
}
