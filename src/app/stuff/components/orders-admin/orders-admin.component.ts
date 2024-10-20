import { NgIf, NgClass, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Pagination } from '../../../shared/interfaces/pagination';
import { Orders } from '../../../shared/interfaces/order';

@Component({
  selector: 'app-orders-admin',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, CommonModule],
  templateUrl: './orders-admin.component.html',
  styleUrl: './orders-admin.component.scss'
})
export class OrdersAdminComponent implements OnInit {
  Orders: Orders[] = [];
  editOrderForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
  })
  addOrderForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
  })
  selectOrder: any;
  editorForm:boolean = false;
  submitForm:boolean = false;
  pagination: Pagination = {};
  limit: number = 10;
  page: number = 1;
  sort='-name'

  constructor( private _ApiService:ApiService ){}

  populateForm(order: any) {
    this.editOrderForm.patchValue({
      name: order.name,
    });
  }

  selectedOrder( order: Orders ){
    this.selectOrder = order == this.selectOrder? null:order;
    this.populateForm(order);

  }

  changePage(page:number){
    this.page = page;
    this.getOrders();
  }

  getOrders(){
    this._ApiService.get<Orders[]>('orders', this.limit, 'user', `&page=${this.page}&sort=${this.sort}&search=${''}`).subscribe({
      next: (res) => {
        this.Orders = res.data as unknown as Orders[];
        this.pagination = res.pagination;
      },
      error: (err) => { }
    })
  }

  delete(order:Orders){
    this._ApiService.delete('Orders', order._id).subscribe({
    next: (res) => {
      this.getOrders();
      // this._NotificationService.showNotification( `order: ${order._id} [Deleted]`)
    },
      error: (err) => { }
    })
  }

  updateOrder(form:FormGroup){
    this._ApiService.update<Orders[]>('orders', form.value, this.selectOrder._id).subscribe({
      next:(res) => {
        this.editorForm = false;
        this.selectOrder = null;
        // this._NotificationService.showNotification('Updated order', 'success' );
        this.getOrders();
      },
      error:(err) => { }
    })
  }

  addOrder(form:FormGroup){
    this._ApiService.post<Orders>('orders', form.value).subscribe({
      next:(res) => {
        this.submitForm = false;
        // this._NotificationService.showNotification('Created order', 'success' );
        this.getOrders();
      },
      error:(err) => { }
    })
  }

  showEditor(bool:boolean){
    if ( !this.selectOrder &&  bool ){
      // this._NotificationService.showNotification('Select order To Update !!', 'error')
    } else
    if (  this.selectOrder.role != 'manager'){
      this.editorForm = bool;
    } 
    // this._NotificationService.showNotification(`You Can't Update Manager Account`, 'error');
  }

  showFieldAdd(bool:boolean){
    this.submitForm = bool;
  }

  filter(s:any){

  }

  ngOnInit(): void {
    this.getOrders();
  }
}