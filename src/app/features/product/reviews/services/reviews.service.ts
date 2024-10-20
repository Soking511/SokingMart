import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../core/services/global.service';

@Injectable({
  providedIn: 'root'
})

export class ReviewsService {
  productImage: string = '';
  constructor(private _GlobalService: GlobalService, private _HttpClient: HttpClient, private _Router: Router) {
    this.productImage = this._GlobalService.productsImage;
  };

}
