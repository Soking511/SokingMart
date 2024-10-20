import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HomeComponent } from "../../../features/home/home.component";
// import { SideCartService } from '../../../shared/services/side-cart.service';
import { NgClass, NgIf } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { CartService } from '../../../shared/services/cart.service';
import { SideCartComponent } from '../../../features/cart/side-cart/side-cart.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, HomeComponent, NgIf, ButtonModule, MenubarModule,
    InputTextModule,
    ButtonModule,
    BadgeModule,
    ButtonModule,InputTextModule,
    NgClass,
    DropdownModule, SideCartComponent,
    MenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})


export class NavbarComponent implements OnInit {
  items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      routerLink: 'home',
    },
    {
      label: 'Collections',
      icon: 'pi pi-fw pi-th-large',
      routerLink: '#',
    },
    {
      label: 'Contact Us',
      icon: 'pi pi-fw pi-envelope',
      routerLink: '#',
    },
  ];

  userMenu: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-fw pi-user',
    },
    {
      label: 'Logout',
      icon: 'pi pi-fw pi-sign-out',
      command: () => this.logout(),
    },
  ];

  isSideCartOpen:boolean = false
  selectedUser: MenuItem | null = null;
  isNavbarOpen: boolean = false;
  onUserMenuChange(event: any) {
    if (event.value) {
      event.value.command();
    }
    this.selectedUser = null; // Reset selection
  }

  isLogin: boolean = false;
  isDropdownOpen: boolean = false;
  itemsQuantity: number = 0;
  @Output() cartClicked = new EventEmitter<void>();

  constructor(
    private _AuthService: AuthService,
    private _CartService: CartService,
    private cdr: ChangeDetectorRef,
  ) {

    this._AuthService.currentUser.subscribe({
      next: () => {
        this.isLogin = (this._AuthService.currentUser.getValue() !== null) ? true : false;
      }
    })
}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this._AuthService.logout();
    this.isDropdownOpen=false;
  }

  ngOnInit(): void {
    this._CartService.cart$.subscribe((cart) => {
      this.itemsQuantity = cart.length;
      this.cdr.detectChanges();
    });
  }
}
