import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { Categories } from '../../shared/interfaces/categories';
import { Pagination } from '../../shared/interfaces/pagination';
import { Products } from '../../shared/interfaces/products';
import { ProductsService } from '../product/services/products.service';
import { BestSellerComponent } from './best-seller/best-seller.component';
import { ApiService } from '../../core/services/api.service';
import { Subcategories } from '../../shared/interfaces/subcategories';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { GlobalService } from '../../core/services/global.service';
import { DescriptionPipe } from '../../shared/pipes/description.pipe';
import { TreeModule } from 'primeng/tree';
import { MessageService, TreeNode } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { BadgeModule } from 'primeng/badge';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CartService } from '../../shared/services/cart.service';
import { HeroSectionsComponent } from "./hero-sections/hero-sections.component";
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AnimateOnScrollModule,
    ImageModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    PanelModule,
    BadgeModule,
    ToastModule,
    ButtonModule,
    TabViewModule,
    TreeModule,
    FormsModule,
    FooterComponent,
    BestSellerComponent,
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    DescriptionPipe,
    HeroSectionsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'], // Corrected "styleUrl" to "styleUrls"
  animations: [
    trigger('cardAnimation', [
      state('normal', style({
        transform: 'scale(1)',
        opacity: 1
      })),
      state('scaled', style({
        transform: 'scale(1.05)',
        opacity: 0.7
      })),
      transition('normal <=> scaled', [
        animate('0.2s ease-in-out')
      ])
    ]),
  ]
})
export class HomeComponent {
  files: TreeNode[] = [];
  isLoading = false;
  currentUserCart: any[] = [];
  products: Products[] = [];
  categories: Categories[] = [];
  subcategories: Subcategories[] = [];
  userCart: any = {};
  categoryForm = new FormGroup({ _id: new FormControl("All", [Validators.required]) });
  subcategoryForm = new FormGroup({ _id: new FormControl("All", [Validators.required]) });
  imgDomain: string = '';
  pagination: Pagination = {};
  limit: number = 8;
  page: number = 1;
  sort: string = '-createdAt';
  search: string = '';
  currentCart: any = {};
  categoryImage = '';

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private _MessageService: MessageService,
    private _ProductsService: ProductsService,
    private _GlobalService: GlobalService,
    private _ApiService: ApiService,
    private _CartService: CartService,
    private cdr: ChangeDetectorRef
  ) {
    this.files = [
      {
        label: 'Shop by Category',
        expanded: true,
        children: []
      },
    ];
  }

  getUserCart() {
    this._CartService.cart$.subscribe((cart) => {
      this.currentUserCart = cart;
      this.cdr.detectChanges();
    });
  }

  getProductItem(productId: string) {
    return this.currentUserCart.find((item: any) => item.product._id === productId);
  }

  loadProducts() {
    this.isLoading = true;
    const categoryFilter = this.categoryForm.get('_id')?.value! !== 'All' ? '&category=' + this.categoryForm.get('_id')?.value! : '';
    const subcategoryFilter = this.subcategoryForm.get('_id')?.value! !== 'All' ? '&subcategory=' + this.subcategoryForm.get('_id')?.value! : '';

    this._ApiService.get<Products[]>( 'products', this.limit, undefined, `&page=${this.page}&sort=${this.sort}&search=${this.search}${categoryFilter}${subcategoryFilter}`)
      .subscribe({
        next: (res) => {
          this.products = res.data;
          this.pagination = res.pagination;
          this.isLoading = false;
        },
        error: (err) => { this.isLoading = false; }
      });
  }

  loadCategories() {
    this._ApiService.get<Categories[]>('categories', 50).subscribe({
      next: (res) => {
        this.categories = res.data;
        for (let category of this.categories) {
          this.files[0].children?.push({
            label: category.name,
            expanded: false,
          });
        }
      },
      error: (err) => { }
    });
  }

  loadSubCategories(category?: string) {
    const categoryFilter = this.categoryForm.get('_id')?.value! !== 'All' ? '&category=' + category : '';
    this._ApiService.get<Subcategories[]>('subcategory', 50, undefined, categoryFilter).subscribe({
      next: (res) => {
        this.subcategories = res.data;
      },
      error: (err) => { }
    });
  }

  addMessage = (severity: string = 'success', summary: string = 'Service Message', detail: string = 'MessageService') =>
    this._MessageService.add({ severity, summary, detail });

  addProductToCart = (product: Products): void => this._CartService.addToCart(product);
  removeProductFromCart = (productId: string): void => this._CartService.removeFromCart(productId);
  updateProductQuantity = (product: Products, quantity: number) =>
    this._CartService.updateQuantity(product._id!, quantity);

  addProductToWishlist(product: any) {
    this._ApiService.post<any>(`wishlist`, { product: product._id }).subscribe({
      next: (res) => {
        this.addMessage('success', 'Success', 'Added to wishlist');
      },
      error: (err) => { }
    });
  }

  onScroll(): void {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;

    if (windowBottom >= docHeight * 0.7 && !this.isLoading && this.page < this.pagination.totalPages!) {
      this.limit += 4;
      this.loadProducts();
    }
  }

  searchProducts(search: string) {
    this.search = search;
    this.loadProducts();
  }

  ngOnInit(): void {
    this.categoryImage = this._GlobalService.categoryImage;
    this.imgDomain = this._ProductsService.productImages;
    this.loadProducts();
    this.loadCategories();
    this.loadSubCategories();
    this.getUserCart();

    fromEvent(window, 'scroll')
      .pipe(debounceTime(200))
      .subscribe(() => this.onScroll());
  }

}
