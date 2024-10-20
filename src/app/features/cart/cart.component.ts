import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { GlobalService } from '../../core/services/global.service';
import { Products } from '../../shared/interfaces/products';
import { CartService } from '../../shared/services/cart.service';
import { HomeComponent } from '../home/home.component';
import { MessageService } from 'primeng/api';
import { AddressService } from '../address/address.service';
import { Address, AddressForm, City } from '../../shared/interfaces/address.address';
import { IItems } from '../../shared/interfaces/order';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, HomeComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit{
  guiPopWindows = { confirmBoolean: false, confirmedOrder: false, editorBoolean: false };
  totalPriceCart: number = 0;
  currentUserCart: IItems[] = [];
  currentUserAddress: any = {};
  selectedState: City[] = [];
  selectedAddress: any;
  imgDomain = ''
  state: any[] = [];
  loading: boolean = false;
  addressForm: FormGroup<AddressForm> = new FormGroup<AddressForm>({
    street: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
  });

  constructor(
    private _CartService: CartService,
    private _AddressService: AddressService,
    private _MessageService: MessageService,
    private _ApiService: ApiService,
    private _GlobalService:GlobalService,
    private cdr:ChangeDetectorRef,
    private _Router:Router
  ){ }

  onStateChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const stateCode = target.value;

    if (stateCode) {
      const selectedState = this.state.find(state => state.code === stateCode);
      this.selectedState = selectedState ? selectedState.cityDataModels : [];
    }
  }

  addOrder() {
    if (!this.selectedAddress) return this.addMessage('error', 'enter any address', 'you can add new if u want');

    this._ApiService.post(`orders`, {address:this.selectedAddress}).subscribe({
      next: (res) => {
        this._CartService.emptyCart();
        this._Router.navigate(['/order-details'])
      },
      error: (err) => { }
    })
  }

  removeProductFromCart = (productId: string): void => this._CartService.removeFromCart(productId);
  updateProductQuantity = (product: Products, quantity: number) => this._CartService.updateQuantity(product._id!, quantity);
  // addUserAddress = (addressForm:FormGroup) => this._AddressService.addUserAddress(addressForm);
  // deleteAddress = (addressSelected:string) => this._AddressService.deleteAddress(addressSelected);

  addMessage = ( severity:string='success', summary:string='Service Message', detail:string='MessageService' ) => this._MessageService.add({severity, summary, detail});

  getUserCart() {
    this._CartService.cart$.subscribe((cart) => {
      this.currentUserCart = cart;
      this.totalPriceCart=0;
      for ( const item of this.currentUserCart ){
        this.totalPriceCart+=item.price!*item.quantity!;
      }
      this.cdr.detectChanges();
      if ( cart.length < 1 ){
        this._Router.navigate(['home']);
        this.addMessage('error', 'you cart is empty', 'Added to wishlist');
      }
    });
  }
  fetchCities(){
    if (this.state.length === 0 && !this.loading) {
      this.loading = true;
      this._ApiService.fetch<any[]>('https://atfawry.fawrystaging.com/ECommerceWeb/api/lookups/govs').subscribe({
        next: (res) => {
          if (res) {
            this.state = res as any;
          }
          this.loading = false;
        },
        error: (err) => { }
      });
    }
  }

  getUserAddress() {
    this._ApiService.get('address', undefined, 'user').subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) {
          this.currentUserAddress = res.data;
          this.selectedAddress = res.data[0];
        }
      },
      error: (err) => { }
    });
  }

  deleteAddress(addressID: string){
    this._ApiService.delete('address', addressID).subscribe({
      next:(res)=>{
        this.getUserAddress();
        // this.selectedAddress = {}
      },
      error:(err)=>{ }
    })
  }

  addUserAddress(formData:any){
    this._ApiService.post('address', {'address':[formData.value]}).subscribe({
      next: (res) => {
        location.reload();
      },
      error: (err) => { }
    });
  }

  ngOnInit(): void {
    this.getUserAddress();
    this.fetchCities();
    this.getUserCart();
    this.imgDomain = this._GlobalService.productsImage;
  }

}
