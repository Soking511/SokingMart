import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { Register, Login, SendMail, VerifyCode, ResetPassword } from '../../shared/interfaces/auth';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl: string = '';
  private authRoute: string = '';
  private apiKey: string = '';
  private userRoute: string = '';
  private addressRoute: string = '';
  currentUser = new BehaviorSubject(null);
  usersImage: string = '';

  constructor(private _GlobalService: GlobalService, private _HttpClient: HttpClient, private _Router: Router) {
    this.baseUrl = this._GlobalService.baseURL;
    this.authRoute = this._GlobalService.authRoute;
    this.userRoute = this._GlobalService.userRoute;
    this.addressRoute = this._GlobalService.addressRoute;
    this.usersImage = this._GlobalService.usersImage;
    this.apiKey = this._GlobalService.apiKey;

    if (localStorage.getItem('user') !== null) {
      this.saveCurrentUser();
    }
  };

  saveCurrentUser() {
    const token = localStorage.getItem('user');
    if (token) {
      this.currentUser.next(jwtDecode(token));
    }
  }

  checkToken() {
    const token = localStorage.getItem('user');

    if (!token) {
      console.error("No token found");
      this.logout();
      return;
    }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp! < Date.now() / 1000) {
      this.logout();
    }
  } catch (error) {
    console.error("Invalid token", error);
    this.logout();
  }
}

  register(formData: Register): Observable<any> {
    // this._
    return this._HttpClient.post(`${this.baseUrl}${this.authRoute}/Register`, formData
      , {
        headers: {
          "X-API-KEY": `${this.apiKey}`,
          "X-CSRF-Token": `${Cookies.get('cookies')}`
        }, withCredentials: true
      })
  }

  login(formData: Login): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}${this.authRoute}/login`, formData, {
      headers: {
        "X-API-KEY": `${this.apiKey}`,
        "X-CSRF-Token": `${Cookies.get('cookies')}`
      }, withCredentials: true
    })
  }

  sendMail(formData: SendMail): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}${this.authRoute}/forgetPassword`, formData, {
      headers: {
        "X-API-KEY": `${this.apiKey}`,
        "X-CSRF-Token": `${Cookies.get('cookies')}`,
      }, withCredentials: true
    })
  }

  verifyCode(formData: VerifyCode): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}${this.authRoute}/verifyCode`, formData, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('verify')}`,
        "X-API-KEY": `${this.apiKey}`,
        "X-CSRF-Token": `${Cookies.get('cookies')}`
      }, withCredentials: true
    })
  }

  resetPassword(formData: ResetPassword): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}${this.authRoute}/resetCode`, formData, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('verify')}`,
        "X-API-KEY": `${this.apiKey}`,
        "X-CSRF-Token": `${Cookies.get('cookies')}`
      }, withCredentials: true
    })
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.next(null);
    this._Router.navigate(['/login'])
  }

  getUser(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}${this.userRoute}/me`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('user')}`,
        "X-API-KEY": `${this.apiKey}`,
      }, withCredentials: true
    })
  }

  updateUser(formData:any, userID:string): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}${this.userRoute}/${userID}`, formData, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('user')}`,
        "X-API-KEY": `${this.apiKey}`,
        "X-CSRF-Token": `${Cookies.get('cookies')}`
      }, withCredentials: true
    })
  }

}
