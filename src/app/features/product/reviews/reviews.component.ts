import { CommonModule, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ProductComponent } from '../product.component';
import { AuthService } from '../../../core/services/auth.service';
import { Products } from '../../../shared/interfaces/products';
import { Reviews, ReviewsResponse } from '../../../shared/interfaces/reviews';
import { ProductsService } from '../services/products.service';
import { ReviewsService } from './services/reviews.service';
import { ApiService } from '../../../core/services/api.service';
import { Users } from '../../../shared/interfaces/uesrs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgClass],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})

export class ReviewsComponent implements OnInit, OnDestroy {
  @ViewChild(ProductComponent) productComponent!: ProductComponent;
  subscription: any;
  product: Products = { product: undefined };
  reviews: Reviews[] = [];
  currentUser = new BehaviorSubject(null);
  id: string = '';
  currentReviewID: string = '';
  editorBoolean: boolean = false;
  confirmBoolean: boolean = false;
  reviewForm = new FormGroup({
    comment: new FormControl(null, [Validators.required, Validators.minLength(10)]),
    rate: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(5)]),
  });
  editForm = new FormGroup({
    comment: new FormControl(null, [Validators.required, Validators.minLength(10)]),
    rate: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(5)]),
  });
  productImage: string = '';

  constructor(
    private _AuthService: AuthService,
    private _ReviewsService: ReviewsService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _ApiService: ApiService,
  ) { }
// `${this.baseUrl}${this.productsRoute}/${productId}/reviews`

getProduct(productId: string) {
  this._ApiService.get<Products>(`products/${productId}`).subscribe({
    next: (res) => { this.product = res.data;
      this.loadProductReviews(productId);
    },
    error: (err) => { },
  });
}

loadProductReviews(productId: string) {
  this._ApiService.get<any>(`products/${productId}/reviews`).subscribe({
    next: (res) => { this.reviews = res.data; },
    error: (err) => { },
  });
}


  deleteReview() {
    this._ApiService.delete(`reviews/${this.currentReviewID}`).subscribe({
      next: (res) => {
        this.showEditor(false);
        this.showDelete(false);
        location.reload();
      },
      error: (err) => {
          this.addMessage('error', 'error', 'Failed to delete review')
      }
    });
  }

  private addMessage ( severity:string='success', summary:string='Service Message', detail:string='MessageService' ){ this._MessageService.add({severity, summary, detail})};

  addReview(productID:string, reviewForm: any) {
    this._ApiService.post<Reviews>(`products/${productID}/reviews`, reviewForm.value).subscribe({
      next: (res) => {
        location.reload();
      },
      error: (err) => {
        if (err.error.errors) {
          this.addMessage('error', 'error', err.error.errors[0].msg);
        } else {
          this.addMessage('error', 'error', 'Login please !')
        }
      }
    })
  }

  updateReview( reviewForm: any) {
    this._ApiService.update<Reviews>(`reviews/${this.currentReviewID}`, reviewForm.value).subscribe({
      next: (res) => {
        location.reload();
        this.addMessage('success', 'Review', 'Added success !')

      },
      error: (err) => {
        if (err.error.errors) {
          this.addMessage('error', 'error', err.error.errors[0].msg)
        } else {
          this.addMessage('error', 'error', 'Login please !')
        }
      }
    })
  }


  setCurrentReviewID( reviewID: string) {
    this.currentReviewID = reviewID;
  }

  showEditor(bool:boolean){
    this.editorBoolean = bool;
  }

  showDelete(bool:boolean){
    this.confirmBoolean = bool;
  }

  ngOnInit(): void {
    this.id = this._ActivatedRoute.snapshot.params['id'];
    // this._AuthService.checkToken();
    this.productImage = this._ReviewsService.productImage;
    this.currentUser = this._AuthService.currentUser;
    this.getProduct(this.id);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
