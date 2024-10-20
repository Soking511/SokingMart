import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Pagination } from '../../../shared/interfaces/pagination';
import { Orders } from '../../../shared/interfaces/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{
  pagination: Pagination = {};
  limit: number = 8;
  page: number = 1;
  orders: Orders[] = [];

  constructor( private _ApiService:ApiService){ }

  getMyOrders(){
    this._ApiService.get<Orders[]>('orders', this.limit, 'user', `&page=${this.page}&sort=-createdAt`).subscribe({
      next: (res) => {
        this.orders = res.data as Orders[];
        this.pagination = res.pagination;
      },
      error: (err) => { }
    })
  }

  changePage(page:number){
    this.page = page;
    this.getMyOrders();
  }

  ngOnInit(): void {
    this.getMyOrders();
  }
}
