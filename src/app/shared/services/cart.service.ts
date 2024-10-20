import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ApiResponse } from '../../core/services/interfaces/api-response.interface';
import { Cart, IItems } from '../interfaces/order';
import { Products } from '../interfaces/products';

@Injectable({
  providedIn: 'root',
})
export class CartService{
  private cartItemsSubject = new BehaviorSubject<IItems[]>([]);
  cart$ = this.cartItemsSubject.asObservable();

  constructor(
    private _ApiService: ApiService,
    private _MessageService:MessageService,
  ) { this.loadCart(); }

  addMessage( severity:string='success', summary:string='Service Message', detail:string='MessageService' ) {
    this._MessageService.add({severity, summary, detail});
  }

  loadCart(): void {
    this._ApiService.get<Cart>('carts', 1, 'user').subscribe({
      next: (response: ApiResponse<Cart>) => {
        const cartItems = response.data.items || [];
        this.cartItemsSubject.next(cartItems);
      },
      error: (err) => { },
    });
  }

  getCart = (): IItems[] => this.cartItemsSubject.getValue();

  addToCart(product: Products): void {
    const currentCart = this.getCart();
    const existingItem = currentCart.find((item) => item.product!._id === product._id);
    if (existingItem) {
      this.updateQuantity(product._id!, 1)
    } else {
      this._ApiService.post('carts', {product:product._id} ).subscribe({
          next:() => {
            this.addMessage('success', 'Success', 'Product added to cart');
            this.loadCart();
          },
          error:() =>{ this.addMessage('error', 'error', 'Product Not Have Quantity');}
      });
    }
  }

  removeFromCart(productId: string): void {
    this._ApiService.delete('carts', productId ).subscribe({
      next:()=>{
        this.addMessage('info', 'Success', 'Product removed from cart');
        this.loadCart();
      }
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentCart = this.getCart();
    const productItem = currentCart.find((item) => item.product!._id === productId);

    if (productItem) {
      if (productItem.quantity!+quantity<=0)
        return this.removeFromCart(productItem._id!);

      this._ApiService.update('carts', {quantity: productItem.quantity!+quantity}, productItem._id).subscribe({
        next: () => {
          this.loadCart();
        },
        error:() =>{ this.addMessage('error', 'error', 'Product Not Have Quantity');}
      });
    }
  }

  emptyCart = () => this.cartItemsSubject.next([]);
}
