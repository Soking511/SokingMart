import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, NgModel, FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Pagination } from '../../../shared/interfaces/pagination';
import { Products } from '../../../shared/interfaces/products';
import { Categories } from '../../../shared/interfaces/categories';
import { Subcategories } from '../../../shared/interfaces/subcategories';
import { GlobalService } from '../../../core/services/global.service';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DropdownModule, FormsModule, InputTextModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})

export class ProductsComponent implements OnInit {
  filteredProducts: Products[] = [];
  products: Products[] = [];

  // Edit product form
  editProductForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    category: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    quantity: new FormControl(null, [Validators.required]),
    subcategory: new FormControl(null),
    cover: new FormControl(null),
    images: new FormControl(null)
  });

  // Add product form
  addProductForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    category: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    quantity: new FormControl(null, [Validators.required]),
    subcategory: new FormControl(null),
    cover: new FormControl(null),
    images: new FormControl(null)
  });

  selectProduct: any;
  editorForm: boolean = false;
  submitForm: boolean = false;
  pagination: Pagination = {};
  limit: number = 6;
  page: number = 1;
  sort = '-name';
  selectedCategory = '';
  selectedSubcategory = '';
  uploadImage: File | null = null; // for the cover image
  uploadImages: File[] = []; // for additional images
  categories: Categories[] = [];
  subcategories: Subcategories[] = [];

  // Category and subcategory forms
  categoryForm = new FormGroup({ _id: new FormControl("All", [Validators.required]), name: new FormControl(null, [Validators.required]) });
  subcategoryForm = new FormGroup({ _id: new FormControl("All", [Validators.required]), name: new FormControl(null, [Validators.required]) });
  imageDomain=''
  searchTerm: any;

  filterProducts() {
    let filtered = this.products;

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(product =>
        product.name!.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter(product =>
        product.category?._id === this.selectedCategory
      );
    }

    // Filter by subcategory
    if (this.selectedSubcategory) {
      filtered = filtered.filter(product =>
        product.subcategory?._id === this.selectedSubcategory
      );
    }

    this.filteredProducts = filtered;
  }

  constructor(private _ApiService: ApiService, private _GlobalService:GlobalService) {}

  // Select category handler
  selectCategory(category: any) {
    this.selectedCategory = category;
  }

  populateForm(product: any) {
    this.editProductForm.patchValue({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      quantity: product.quantity,
      subcategory: product.subcategory
    });
  }

  // Handle product selection
  selectedProduct(product: Products) {
    this.selectProduct = this.selectProduct === product ? null : product;
    this.populateForm(product);
  }

  // Change page for pagination
  changePage(page: number) {
    this.page = page;
    this.Products();
  }

  // Fetch products from the API
  Products() {
    this._ApiService.get<Products[]>('products', this.limit, undefined, `&page=${this.page}&sort=${this.sort}&search=${''}`).subscribe({
      next: (res) => {
        this.products = res.data;
        this.pagination = res.pagination;
      },
      error: (err) => { console.error(err); }
    });
    this.loadCategories();
    this.loadSubCategories();
  }

  // Set cover image
  setProductImage(event: any) {
    const imageFile = event.target.files[0];
    if (imageFile) {
      this.uploadImage = imageFile; // Store the cover image
    }
  }

  // Set additional images
  setProductImages(event: any) {
    const imageFiles = event.target.files;
    if (imageFiles.length > 0) {
      this.uploadImages = Array.from(imageFiles);
    }
  }

  // Delete product
  delete(product: Products) {
    this._ApiService.delete('products', product._id).subscribe({
      next: (res) => {
        this.Products();
      },
      error: (err) => { console.error(err); }
    });
  }

  updateProduct(form: FormGroup) {
    const formData = new FormData();

    Object.keys(form.value).forEach(key => {
      formData.append(key, form.get(key)?.value);
    });

    if (this.uploadImage) formData.append('cover', this.uploadImage);
    this.uploadImages.forEach((image) => formData.append('images', image));

    this._ApiService.update<Products[]>('products', formData, this.selectProduct._id).subscribe({
      next: (res) => {
        this.editorForm = false;
        this.selectProduct = null;
        this.Products();
      },
      error: (err) => { console.error(err); }
    });
  }

  // Add new product
  addProduct(form: FormGroup) {
    const formData = new FormData();
    Object.keys(form.value).forEach(key => {
      formData.append(key, form.get(key)?.value);
    });

    if (this.uploadImage) formData.append('cover', this.uploadImage);
    this.uploadImages.forEach((image) => formData.append('images', image));

    this._ApiService.post<Products[]>('products', formData).subscribe({
      next: (res) => {
        this.submitForm = false;
        this.Products();
      },
      error: (err) => { console.error(err); }
    });
  }

  showEditor(bool:boolean){
    if ( bool ) this.Products();
    this.editorForm = bool;
  }

  showFieldAdd(bool:boolean){
    if ( bool ) this.Products();
    this.submitForm = bool;
  }


  loadSubCategories(category?: string) {
    const query = category && category !== 'All' ? `&category=${category}` : '';
    this._ApiService.get<Subcategories[]>('subcategory', 50, undefined, query).subscribe({
      next: (res) => {
        this.subcategories = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadCategories() {
    this._ApiService.get<Categories[]>('categories', 50).subscribe({
      next: (res) => {
        this.categories = res.data},
      error: (err) => { }
    })
  }


  ngOnInit(): void {
    this.imageDomain = this._GlobalService.productsImage;
    this.Products();
  }

}
