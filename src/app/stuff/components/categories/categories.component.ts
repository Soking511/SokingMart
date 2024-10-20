import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { Categories } from '../../../shared/interfaces/categories';
import { Pagination } from '../../../shared/interfaces/pagination';
import { GlobalService } from '../../../core/services/global.service';
import { Products } from '../../../shared/interfaces/products';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})

export class CategoriesComponent  implements OnInit {
  categories: Categories[] = [];
  editCategoryForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    cover: new FormControl(null),
  })
  addCategoryForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    cover: new FormControl(null),
  })
  selectCategory: any;
  editorForm:boolean = false;
  submitForm:boolean = false;
  uploadImage: File | null = null;
  pagination: Pagination = {};
  limit: number = 10;
  page: number = 1;
  sort='-name'
  imgDomain:string=''

  constructor(
    private _ApiService:ApiService,
    private _GlobalService:GlobalService
  ){
    this.imgDomain = this._GlobalService.categoryImage;
  }

  setCategoryImage(event: any) {
    const images = event.target.files;
    if (images.length) {
      this.uploadImage = images[0];
    }
  }

  populateForm(Category: any) {
    this.editCategoryForm.patchValue({
      name: Category.name,
    });
  }

  selectedCategory( Category: Categories ){
    this.selectCategory = Category == this.selectCategory? null:Category;
    this.populateForm(Category);

  }

  changePage(page:number){
    this.page = page;
    this.getCategories();
  }

  getCategories(){
    this._ApiService.get<Categories[]>('categories', this.limit, undefined, `&page=${this.page}&sort=${this.sort}&search=${''}`).subscribe({
      next: (res) => {
        this.categories = res.data as unknown as Categories[];
        this.pagination = res.pagination;
      },
      error: (err) => { }
    })
  }

  delete(category:Categories){
    this._ApiService.delete('categories', category._id).subscribe({
    next: (res) => {
      this.getCategories();
      // this._NotificationService.showNotification( `category: ${category.name} [Deleted]`)
    },
      error: (err) => { }
    })
  }

  updateCategory(form:FormGroup){
    const formData = new FormData();

    Object.keys(form.value).forEach(key => {
      formData.append(key, form.get(key)?.value);
    });

    if (this.uploadImage) formData.append('cover', this.uploadImage);

    this._ApiService.update<Categories[]>('categories', formData, this.selectCategory._id).subscribe({
      next:(res) => {
        this.editorForm = false;
        this.selectCategory = null;
        // this._NotificationService.showNotification('Updated Category', 'success' );
        this.getCategories();
      },
      // error:(err) => { }
    })
  }

  addCategory(form: FormGroup) {
    const formData = new FormData();

    Object.keys(form.value).forEach(key => {
      formData.append(key, form.get(key)?.value);
    });
    if (this.uploadImage) formData.append('cover', this.uploadImage);

    this._ApiService.post<Categories[]>('categories', formData).subscribe({
      next: (res) => {
        this.submitForm = false;
        // this._NotificationService.showNotification('Created Category', 'success');
        this.getCategories();
      },
      error: (err) => {
        // this._NotificationService.showNotification(err.error?.errors[0]?.msg || 'Error occurred', 'error');
      }
    });
  }

  showEditor(bool:boolean){
    if ( !this.selectCategory &&  bool ){
      // this._NotificationService.showNotification('Select Category To Update !!', 'error')
    } else
    if (  this.selectCategory.role != 'manager'){
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
    this.imgDomain = this._GlobalService.categoryImage;
    this.getCategories();
  }


}