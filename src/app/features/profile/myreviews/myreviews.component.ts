import { Component, OnInit } from '@angular/core';
import { Reviews } from '../../../shared/interfaces/reviews';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-myreviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myreviews.component.html',
  styleUrl: './myreviews.component.scss'
})
export class MyreviewsComponent implements OnInit{
  currentReviewID:string='';
  confirmDelete:boolean=false;

  constructor( private _ApiService:ApiService) {}

  reviews: any = {}
  getReviews(){
    this._ApiService.get( 'reviews/me', undefined, 'user').subscribe({
      next: (res) => {
        this.reviews=res.data as Reviews[];
      },
      error: (error)  => { }

    })
  }

  selectedItem( review: any ){
    this.currentReviewID = review == this.currentReviewID && review != ''? '':review;
  }

  deleteReview( review:string ){
    this._ApiService.delete(`reviews/${review}` ).subscribe({
      next:(res) => {
        // this._NotificationService.showNotification( 'Review Deleted', 'success' );
        this.getReviews();
      },
      error:(err) => {}
    })
  }

  showConfirm( bool:boolean ){
    this.confirmDelete=bool;
  }

  ngOnInit(): void {
    this.getReviews();
  }
}
