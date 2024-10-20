import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Orders } from '../../../shared/interfaces/order';
import { GlobalService } from '../../../core/services/global.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})

export class OrderDetailsComponent implements OnInit{
  tempCart: any = { }
  imageDomain:string ='';
  constructor( private cdr: ChangeDetectorRef, private _ApiService:ApiService, private _GlobalService:GlobalService ){ }

  clearCart() {
    this.cdr.detectChanges();
  }


  ngOnInit(): void {
    this.imageDomain = this._GlobalService.productsImage;
    this._ApiService.get<Orders[]>('orders', 1, 'user').subscribe({
      next: (res) => { this.tempCart = res.data as Orders[] },
      error: (error) => { }
    })
    this.clearCart();
  }
}
