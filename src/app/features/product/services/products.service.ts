import { Injectable } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  productImages: string = ``
  constructor(private _GlobalService: GlobalService) {
    // this.baseUrl = this._GlobalService.baseURL;
    // this.productsRoute = this._GlobalService.productsRoute;
    this.productImages = this._GlobalService.productsImage;
    // this.apiKey = this._GlobalService.apiKey;
  }

  // getAllProducts(limit: number = 16, page: number = 1, sort: string = '-createdAt', search: string, category?: string, subcategory?: string): Observable<any> {
  //     return this._HttpClient.get(`${this.baseUrl}${this.productsRoute}?limit=${limit}&page=${page}&sort=${sort}&search=${search}${category? `&category=${category}`:''}${subcategory? `&subcategory=${subcategory}`:''}`, {
  //       headers: {
  //         "X-API-KEY": `${this.apiKey}`
  //       },
  //       withCredentials: true
  //     })
  // }

  // getProductByID(productId: string): Observable<any> {
  //   return this._HttpClient.get(`${this.baseUrl}${this.productsRoute}/${productId}`, {
  //     headers: {
  //       "X-API-KEY": `${this.apiKey}`
  //     },
  //     withCredentials: true
  //   })
  // }


  // getProductReview(productId: string): Observable<any> {
  //   return this._HttpClient.get(`${this.baseUrl}${this.productsRoute}/${productId}/reviews`, {
  //     headers: {
  //       "X-API-KEY": `${this.apiKey}`
  //     },
  //     withCredentials: true
  //   })
  // }
}
