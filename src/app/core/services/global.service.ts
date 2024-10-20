import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GlobalService {
  baseURL:string = "https://ashoq-ser.onrender.com/";
  version:string = 'api/v1'
  authRoute: string = 'api/v1/auth';
  productsRoute: string = 'api/v1/products';
  categoryRoute: string = 'api/v1/categories';
  subcategoryRoute: string = 'api/v1/subcategory';
  userRoute: string = 'api/v1/users';
  orderRoute: string = 'api/v1/orders';
  addressRoute: string = 'api/v1/address';
  reviewsRoute: string = 'api/v1/reviews';
  cartRoute: string = 'api/v1/carts';
  productsImage: string = `https://raw.githubusercontent.com/Soking511/e-commerce/refs/heads/main/server/uploads/products/`;
  usersImage: string = `https://raw.githubusercontent.com/Soking511/e-commerce/refs/heads/main/server/uploads/users/`;
  categoryImage: string = `https://raw.githubusercontent.com/Soking511/e-commerce/refs/heads/main/server/uploads/categories/`;
  apiKey: string = 'secret123';
  constructor(private _HttpClient:HttpClient) { }

  fetchCities(): Observable<any> {
    return this._HttpClient.get(`https://atfawry.fawrystaging.com/ECommerceWeb/api/lookups/govs`);
  }

  get(endpoint: string, ...params: string[]): Observable<any> {
    const tempString: string = params.join('/');
    const fullUrl = `${endpoint}/${tempString}`;
    return this._HttpClient.get(fullUrl);
  }

}
