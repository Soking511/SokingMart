import { Component } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Order, Orders } from '../../shared/interfaces/order';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})


export class OrderComponent {
  currentOrder: any[] = [];
  orders: any[] = [];

  constructor(
    private _ApiService: ApiService,
  ) { }

  getAllOrders(){
    this._ApiService.get('orders').subscribe({
      next: (res) => {
        this.orders = res.data as Orders[];
      },
      error: (err) => { }
    })
  }

  removeOrder(OrderID:string) {
    this._ApiService.delete(`orders/${OrderID}`).subscribe({
      next: (res) => {
        // this.addMessage('success', 'Category Removed', 'MessageService');

      },
      error: (err) => { }
    })
  }

  getOrder(OrderID:string) {
    this._ApiService.get<Order>(`orders/${OrderID}`, 1).subscribe({
      next: (res) => {
        this.currentOrder = res.data as Order[]
      },
      error: (err) => { }
    })
  }

}
