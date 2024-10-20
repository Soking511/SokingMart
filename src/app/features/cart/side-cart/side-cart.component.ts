import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { Products } from '../../../shared/interfaces/products';
import { CartService } from '../../../shared/services/cart.service';
import { Cart, IItems } from '../../../shared/interfaces/order';
import { RouterLink } from '@angular/router';
// import { Products, CartItems } from '@angular/'

@Component({
  selector: 'app-side-cart',
  standalone: true,
  imports: [NgIf, CommonModule, RouterLink],
  templateUrl: './side-cart.component.html',
  styleUrl: './side-cart.component.scss'
})
export class SideCartComponent implements OnInit{
  productDomain:string =''
  currentUserCart: IItems[] = [];
  totalPriceCart: number = 0;
  @Input() sideCart = false;
  @Output() sideCartChange = new EventEmitter<boolean>();

  constructor(
    private _GlobalService:GlobalService,
    private _CartService:CartService,
    private cdr:ChangeDetectorRef,
   ){ }


   removeProductFromCart(productId: string) {
    this._CartService.removeFromCart(this.currentUserCart.find((item: any) => item.product._id === productId)!._id!);
  }
  
  getUserCart() {
    this._CartService.cart$.subscribe((cart) => {
      this.currentUserCart = cart;
      this.totalPriceCart=0;
      for ( const item of cart ){
        this.totalPriceCart+=item.price!*item.quantity!;
      }
      this.cdr.detectChanges();
    });
  }

  closeSideCart(): void {
    this.sideCart = false;
    this.sideCartChange.emit(this.sideCart);
  }

  ngOnInit(): void {
    this.productDomain = this._GlobalService.productsImage;
    this.getUserCart();
  }
}
