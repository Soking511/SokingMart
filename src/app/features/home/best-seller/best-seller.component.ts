import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Products } from '../../../shared/interfaces/products';
import { DescriptionPipe } from '../../../shared/pipes/description.pipe';
import { ProductsService } from '../../product/services/products.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-best-seller',
  standalone: true,
  imports: [CommonModule, RouterLink, DescriptionPipe, RouterLink],
  templateUrl: './best-seller.component.html',
  styleUrl: './best-seller.component.scss'
})
export class BestSellerComponent implements OnInit{
  products: Products[] = [];
  imgDomain: string = '';
  constructor(private _ApiService: ApiService, private _ProductsService: ProductsService) { }

  loadProducts() {
    this._ApiService.get<Products[]>('products', 16, undefined, `&page=${1}&sort=-sold&`).subscribe({
      next: (res) => {
        this.products = res.data;
      },
      error: (err) => { }
    })
  }


  ngOnInit(): void {
    this.imgDomain = this._ProductsService.productImages;
    this.loadProducts();
  }

}
