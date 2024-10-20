import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mywishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mywishlist.component.html',
  styleUrl: './mywishlist.component.scss'
})
export class MywishlistComponent implements OnInit{
  currentProductID:string='';
  confirmDelete:boolean=false;
  products: any = {}

  constructor( private _ApiService:ApiService) {}

  getWishlistItems(){
    this._ApiService.get<any>( 'wishlist', undefined, 'user').subscribe({
      next: (res) => {
        this.products=res.data as any[];
      },
      error: (error)  => { }

    })
  }

  selectedItem( product: any ){
    this.currentProductID = product == this.currentProductID && product != ''? '':product;
  }

  deleteItem( product:string ){
    this._ApiService.delete(`wishlist/${product}` ).subscribe({
      next:(res) => {
        // this._NotificationService.showNotification( 'Item Removed', 'success' );
        this.getWishlistItems();
      },
      error:(err) => {}
    })
  }

  showConfirm( bool:boolean ){
    this.confirmDelete=bool;
  }

  ngOnInit(): void {
    this.getWishlistItems();
  }
}
