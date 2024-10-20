import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { Users } from '../../shared/interfaces/uesrs';
import { Router, RouterLink } from '@angular/router';
import { OrdersComponent } from "./orders/orders.component";
import { MyprofileComponent } from "./myprofile/myprofile.component";
import { MyreviewsComponent } from './myreviews/myreviews.component';
import { MywishlistComponent } from './mywishlist/mywishlist.component';
import { UsersComponent } from '../../stuff/components/users/users.component';
import { CategoriesComponent } from "../../stuff/components/categories/categories.component";
import { SubcategoriesComponent } from "../../stuff/components/subcategories/subcategories.component";
import { CouponsComponent } from "../../stuff/components/coupons/coupons.component";
import { OrdersAdminComponent } from "../../stuff/components/orders-admin/orders-admin.component";
import { ProductsComponent } from "../../stuff/components/products/products.component";
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ToastModule, ReactiveFormsModule, CommonModule, RouterLink, OrdersComponent, MyprofileComponent, MyreviewsComponent, MywishlistComponent, UsersComponent, CategoriesComponent, SubcategoriesComponent, CouponsComponent, OrdersAdminComponent, ProductsComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  currentUser: any;
  userImage: any;
  uploadImage: any;
  isAdmin = false;
  isSidebarOpen = true;
  OperationSelected=''
  Operations = [
    { name: 'My Profile', icon: 'account_circle', showSections: false },
    { name: 'My Orders', icon: 'shopping_cart', showSections: false },
    { name: 'Reviews', icon: 'rate_review', showSections: false },
    { name: 'My Wishlist', icon: 'favorite', showSections: false },
    { name: 'Logout', icon: 'logout', showSections: false, url: '/home' },
  ];

  AdminOperations = [
    { name: 'Manage Users', icon: 'group', showSections: false },
    { name: 'Products', icon: 'inventory', showSections: false },
    { name: 'Categories', icon: 'category', showSections: false },
    { name: 'Subcategories', icon: 'subdirectory_arrow_right', showSections: false },
    { name: 'Coupons', icon: 'local_offer', showSections: false },
    { name: 'Orders', icon: 'list_alt', showSections: false },
  ];

  constructor(private _AuthService: AuthService, private _ApiService: ApiService, private _Router:Router) { }

  redirect(url:string){
    if ( url ){
      this._Router.navigate(['/'+url])
      if ( url == '/home' ) {
        this._AuthService.logout();
      }
    }
  }

  getCurrentUserInfo() {
    this._ApiService.get<Users>('users/me', undefined, 'user').subscribe({
      next: (res) => {
        this.currentUser = res.data;
        if ( res.data.role == 'manager' ){
          this.isAdmin = true;
        }
      },
      error: (err) => { }
    });
  }

  sideBar(bool:boolean){
    this.isSidebarOpen = bool;
  }

  selected(Operation:any){
    this.OperationSelected=(this.OperationSelected == Operation)? null:Operation;
    this.Operations.forEach(op => {
      if (op.name !== this.OperationSelected) {
        op.showSections = false;
      } else {
        op.showSections = true;
      }
    });
  }


  ngOnInit(): void {
    this.getCurrentUserInfo();
    this.userImage = this._AuthService.usersImage;
  }
}
