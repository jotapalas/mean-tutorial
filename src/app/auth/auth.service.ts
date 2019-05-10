import { Injectable,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }


  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post('http://localhost:1337/api/auth/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  getAuthStatuusListener() {
    return this.authStatusListener.asObservable();
  }

  login(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{token: string}>('http://localhost:1337/api/auth/login', authData)
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
