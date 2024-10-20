import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Products } from '../../shared/interfaces/products';
import { ReviewsComponent } from './reviews/reviews.component';
import { ProductsService } from './services/products.service';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReviewsComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})

export class ProductComponent implements OnInit {
  product: Products = { product: undefined };
  imgDomain: string = '';
  id: string = '';
  reviewError: string = '';
  reviewForm = new FormGroup({
    comment: new FormControl(null, [Validators.required, Validators.minLength(10)]),
    rate: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(5)]),
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private _CartService:CartService,
    private _ProductsService: ProductsService,
    private _ApiService:ApiService,
    private _ActivatedRoute: ActivatedRoute,
  ) { }

  loadProduct(productId: string) {
    this._ApiService.get<Products>(`products/${productId}`).subscribe({
      next: (res) => { this.product = res.data;},
      error: (err) => { },
    })
  }

  addProductToCart = (product: Products): void => this._CartService.addToCart(product);

  getUserCart() {
    this._ApiService.get<any>('carts', undefined, 'user').subscribe({
      next: (res) => {
        this.cdr.detectChanges();
      },
      error: (err) => { }
    });
  }


  ngOnInit(): void {
    this.getUserCart();
    this.id = this._ActivatedRoute.snapshot.params['id'];
    this.imgDomain = this._ProductsService.productImages;
    this.loadProduct(this.id);
  }
}
