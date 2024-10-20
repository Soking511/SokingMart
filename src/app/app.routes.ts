import { RouterModule, Routes } from '@angular/router';
import { N404Component } from './core/components/n404/n404.component';
import { NgModule } from '@angular/core';


export const routes: Routes = [
  // User Profile [Overview, Settings]
  {path:"profile", title:"", loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)},
  // Home
  {path:"", redirectTo:"home", pathMatch:"full"},
  {path:"home", title:"home", loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)},
  // products
  {path:"products/:id", title:"product", loadComponent: () => import('./features/product/product.component').then(m => m.ProductComponent)},
  // User [login-register]
  {path:"login", title:"Login", loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)},
  {path:"register", title:"Create Account", loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent)},
  // Cart
  {path:"cart", title:"My Cart", loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)},
  // Order View
  {path:"order", title:"Order View", loadComponent: () => import('./features/order/order.component').then(m => m.OrderComponent)},
  // Orders
  {path:"myOrders", title:"My Orders", loadComponent: () => import('./features/profile/orders/orders.component').then(m => m.OrdersComponent)},
  // Order Final View
  {path:"order-details", title:"Order View", loadComponent: () => import('./features/cart/order-details/order-details.component').then(m => m.OrderDetailsComponent)},

  // Error: 404 !
  {path:"**", title:"Not Found!", component:N404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}