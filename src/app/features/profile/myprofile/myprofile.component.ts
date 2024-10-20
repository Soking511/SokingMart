import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { Users } from '../../../shared/interfaces/uesrs';

@Component({
  selector: 'app-myprofile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './myprofile.component.html',
  styleUrl: './myprofile.component.scss'
})
export class MyprofileComponent implements OnInit {
  currentUser: any;
  userImage: any;
  uploadImage: any;
  updateForm: FormGroup;
  OperationSelected=''
  Operations = [
    {
      name: 'My Profile',
      route: 'profile',
      showSections: false,
    },
    {
      name: 'Orders',
      route: 'Orders',
      showSections: false,
    },
    {
      name: 'Orders',
      route: 'Orders',
      showSections: false,
    },
    {
      name: 'My Wishlist',
      route: 'wishlist',
      showSections: false,
    },
  ];

  constructor(private _AuthService: AuthService, private _ApiService: ApiService) {
    this.updateForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required])
    });
  }

  setUserImage(event: any) {
    const images = event.target.files;
    if (images) {
      this.uploadImage = images[0];
    }
  }

  getCurrentUserInfo() {
    this._ApiService.get<Users>('users/me', undefined, 'user').subscribe({
      next: (res) => {
        this.currentUser = res.data;
        this.updateForm.patchValue({
          name: this.currentUser.name,
          phone: this.currentUser.phone,
        });
      },
      error: (err) => { }
    });
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

  updateUser() {
    const formData = new FormData();
    if (this.uploadImage) { formData.append('image', this.uploadImage); }

    formData.append('name', this.updateForm.get('name')?.value);
    formData.append('phone', this.updateForm.get('phone')?.value);

    this._ApiService.update('users', formData, this.currentUser._id).subscribe({
      next: (res) => { this.getCurrentUserInfo(); },
      error: (err) => {}
    });
  }

  ngOnInit(): void {
    this.getCurrentUserInfo();
    this.userImage = this._AuthService.usersImage;
  }
}

