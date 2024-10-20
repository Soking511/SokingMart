import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Pagination } from '../../../shared/interfaces/pagination';
import { CommonModule } from '@angular/common';
import { Coupons } from '../../../shared/interfaces/coupon';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {
  coupons: any[] = [];

  editCouponForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    discount: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
    expireTime: new FormControl(null, [Validators.required]),
  });

  addCouponForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    discount: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
    expireTime: new FormControl(this.formatDate(new Date), [Validators.required]),
  });

  selectCoupon: any;
  editorForm: boolean = false;
  submitForm: boolean = false;
  pagination: Pagination = {};
  limit: number = 10;
  page: number = 1;
  sort = '-name';

  constructor(private _ApiService: ApiService) { }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  populateForm(coupon: any) {
    this.editCouponForm.patchValue({
      name: coupon.name,
      discount: coupon.discount,
      expireTime: coupon.expireTime
    });
  }

  selectedCoupon(coupon: Coupons) {
    this.selectCoupon = coupon === this.selectCoupon ? null : coupon;
    this.populateForm(coupon);
  }

  changePage(page: number) {
    this.page = page;
    this.getCoupons();
  }

  getCoupons() {
    this._ApiService.get<Coupons[]>('coupons', this.limit, 'user', `&page=${this.page}&sort=${this.sort}&search=${''}`).subscribe({
      next: (res) => {
        this.coupons = res.data as Coupons[];
        this.pagination = res.pagination;
      },
      error: (err) => { }
    });
  }

  delete(coupon: Coupons) {
    this._ApiService.delete('coupons', coupon._id).subscribe({
      next: (res) => {
        this.getCoupons();
        // this._NotificationService.showNotification(`Coupon: ${coupon.name} [Deleted]`);
      },
      error: (err) => { }
    });
  }

  updateCoupon(form: FormGroup) {
    this._ApiService.update<Coupons[]>('coupons', form.value, this.selectCoupon._id).subscribe({
      next: (res) => {
        this.editorForm = false;
        this.selectCoupon = null;
        // this._NotificationService.showNotification('Updated Coupon', 'success');
        this.getCoupons();
      },
      error: (err) => { }
    });
  }

  addCoupon(form: FormGroup) {
    this._ApiService.post<Coupons>('coupons', form.value).subscribe({
      next: (res) => {
        this.submitForm = false;
        // this._NotificationService.showNotification('Created Coupon', 'success');
        this.getCoupons();
      },
      error: (err) => {
        // this._NotificationService.showNotification(err.error.errors[0].msg, 'error');
      }
    });
  }

  showEditor(bool: boolean) {
    if (!this.selectCoupon && bool) {
      // this._NotificationService.showNotification('Select Coupon To Update !!', 'error');
    } else if (this.selectCoupon.role !== 'manager') {
      this.editorForm = bool;
    } else {
      // this._NotificationService.showNotification(`You Can't Update Manager Account`, 'error');
    }
  }

  showFieldAdd(bool: boolean) {
    this.submitForm = bool;
  }

  filter(s: any) { }

  ngOnInit(): void {
    this.getCoupons();
  }
}
