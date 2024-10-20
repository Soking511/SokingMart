import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Cookies from 'js-cookie';
import { ApiResponse } from './interfaces/api-response.interface';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  baseURL=''; version=''; apiKey='';

  constructor( private _GlobalService:GlobalService, private _AuthService:AuthService, private _Http:HttpClient ) {
    this.baseURL = _GlobalService.baseURL;
    this.version = _GlobalService.version;
    this.apiKey = _GlobalService.apiKey;
  }

  get<Interface>(route: string, quantity?: number, role?: string, query?: string):Observable<any> {
    if (role) this._AuthService.checkToken();

    const headers: { [key: string]: string } = { "X-API-KEY": this.apiKey };

    if (role) headers['authorization'] = `Bearer ${localStorage.getItem('user')}`;

    return this._Http.get<ApiResponse<Interface>>(
      `${this.baseURL}${this.version}/${route}${quantity ? '?limit=' + quantity : ''}${(quantity || !query) ? '' : '?'}${query || ''}`,
      { headers, withCredentials: true }
    ).pipe(
      catchError((error) => {
        if (error.status === 0) {
          return throwError('Connection error');
        } else if (error.status >= 400 && error.status < 500) {
          return throwError('Client error');
        } else if (error.status >= 500) {
          return throwError('Server error');
        }
        return throwError('error');
      })
    );

  }

  fetch = <Interface>(route: string) => this._Http.get<ApiResponse<Interface>>(route);

  update<Interface>(route: string, data:any, id?:string):Observable<any> {
    this._AuthService.checkToken();

    return this._Http.put<ApiResponse<Interface>>(`${this.baseURL}${this.version}/${route}${id?`/${id}` : ''}`, data, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('user')}`,
        "X-API-KEY": `${this.apiKey}`,
        "X-CSRF-Token": `${Cookies.get('cookies')}`
      }, withCredentials: true
    })
  }

  post<Interface>(route: string, data:any, id:string=''):Observable<any> {
    this._AuthService.checkToken();

    return this._Http.post<ApiResponse<Interface>>(`${this.baseURL}${this.version}/${route}${id?`/${id}` : ''}`, data, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('user')}`,
        "X-API-KEY": `${this.apiKey}`,
        "X-CSRF-Token": `${Cookies.get('cookies')}`
      }, withCredentials: true
    })
  }

  delete(route: string, id?:string):Observable<any> {
    this._AuthService.checkToken();

    return this._Http.delete(`${this.baseURL}${this.version}/${route}${id?`/${id}` : ''}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('user')}`,
        "X-API-KEY": `${this.apiKey}`,
        "X-CSRF-Token": `${Cookies.get('cookies')}`
      }, withCredentials: true
    })
  }

}
