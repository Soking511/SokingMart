import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { Pagination } from '../../../shared/interfaces/pagination';
import { Subcategories } from '../../../shared/interfaces/subcategories';
import { Categories } from '../../../shared/interfaces/categories';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-subcategories',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.scss'] // Fix 'styleUrl' to 'styleUrls'
})
export class SubcategoriesComponent implements OnInit {
  subcategories: Subcategories[] = [];
  categories: Categories[] = [];
  editSubcategoryForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    cover: new FormControl(null),
    category: new FormControl(null, [Validators.required])
  });
  addSubCategoryForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    cover: new FormControl(null),
    category: new FormControl(null, [Validators.required])
  });
  selectSubcategory: any;
  editorForm: boolean = false;
  submitForm: boolean = false;
  uploadImage: File | null = null;
  pagination: Pagination = {};
  limit: number = 10;
  page: number = 1;
  sort = '-name';
  selectedCategory = '';

  constructor(private _ApiService: ApiService, private _MessageService:MessageService) {}

  selectCategory(category: any) {
    this.selectedCategory = category;
  }

  populateForm(subcategory: any) {
    this.editSubcategoryForm.patchValue({
      // category: this.selectedCategory,
    });
    this.addSubCategoryForm.patchValue({
      // category: subcategory.name,
    });
  }

  selectedSubcategory(subcategory: Subcategories) {
    this.selectSubcategory = subcategory == this.selectSubcategory ? null : subcategory;
    this.populateForm(subcategory);
  }

  setSubcategoryImage(event: any) {
    const images = event.target.files;
    if (images.length) {
      this.uploadImage = images[0];
    }
  }

  changePage(page: number) {
    this.page = page;
    this.getSubcategories();
  }

  getSubcategories() {
    this._ApiService.get<Subcategories[]>('subcategory', this.limit, undefined, `&page=${this.page}&sort=${this.sort}&search=${''}`).subscribe({
      next: (res) => {
        this.subcategories = res.data as unknown as Subcategories[];
        this.pagination = res.pagination;
      },
      error: (err) => { }
    });
  }

  getCategories() {
    this._ApiService.get<Categories[]>('categories', 50).subscribe({
      next: (res) => {
        this.categories = res.data as unknown as Categories[];
      },
      error: (err) => { }
    });
  }

  delete(subcategory: Subcategories) {
    this._ApiService.delete('subcategory', subcategory._id).subscribe({
      next: (res) => {
        this.getSubcategories();
        this.addMessage('success', `Subcategory: ${subcategory.name} [Deleted]`, 'MessageService');
      },
      error: (err) => { }
    });
  }

  updateSubcategory(form: FormGroup) {
    const formData = new FormData();

    Object.keys(form.value).forEach(key => {
      formData.append(key, form.get(key)?.value);
    });

    if (this.uploadImage) formData.append('cover', this.uploadImage);
    this._ApiService.update<Subcategories[]>('subcategory', formData, this.selectSubcategory._id).subscribe({
      next: (res) => {
        this.editorForm = false;
        this.selectSubcategory = null;
        this.addMessage('success', 'Updated subcategory', 'MessageService');
        this.getSubcategories();
      },
      error: (err) => { }
    });
  }

  addSubcategory(form: FormGroup) {
    const formData = new FormData();

    Object.keys(form.value).forEach(key => {
      formData.append(key, form.get(key)?.value);
    });

    if (this.uploadImage) formData.append('cover', this.uploadImage);
    this._ApiService.post<Subcategories[]>('subcategory', formData).subscribe({
      next: (res) => {
        this.submitForm = false;
        this.getSubcategories();
        this.addMessage('success', 'Created subcategory', 'MessageService');
      },
      error: (err) => {
        this.addMessage('error', err.error.errors[0]?.msg || 'Error creating subcategory', 'MessageService');
      }
    });
  }

  showEditor(bool: boolean) {
    if (bool) this.getCategories();
    if (!this.selectSubcategory && bool) {
      this.addMessage('error', 'Select subcategory To Update !!', 'MessageService');
    } else if (this.selectSubcategory.role != 'manager') {
      this.editorForm = bool;
    } else {
      this.addMessage('error', `You Can't Update Manager Account`, 'MessageService');
    }
  }

  showFieldAdd(bool: boolean) {
    if (bool) this.getCategories();
    this.submitForm = bool;
  }

  filter(s: any) {
    // Filtering logic here
  }

  ngOnInit(): void {
    this.getSubcategories();
  }

  addMessage = (severity: string = 'success', summary: string = 'Service Message', detail: string = 'MessageService') =>
    this._MessageService.add({ severity, summary, detail });
}
