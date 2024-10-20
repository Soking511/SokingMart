import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NgClass, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pagination } from '../../../shared/interfaces/pagination';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  editUserForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    role: new FormControl(null, [Validators.required]),
    active: new FormControl(null, [Validators.required])
  });
  addUserForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    confirmPassword: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    role: new FormControl(null, [Validators.required])
  });

  selectedUser: any = {}; // Specify type
  isEditing: boolean = false;
  isAdding: boolean = false;
  pagination: Pagination = {};
  limit: number = 10;
  page: number = 1;
  sort = '-name';
  uploadImage: File | null = null; // Specify type

  // Define addMessage function
  addMessage = (severity: string = 'success', summary: string = 'Service Message', detail: string = 'MessageService') => {
    this._MessageService.add({ severity, summary, detail });
  };

  constructor(private apiService: ApiService, private _MessageService: MessageService) {}

  populateForm(user: any) {
    this.editUserForm.patchValue({
      name: user.name,
      phone: user.phone,
      role: user.role,
      active: user.active
    });
  }

  selectUser(user: any) {
    this.selectedUser = user === this.selectedUser ? null : user;
    if (this.selectedUser) {
      this.populateForm(this.selectedUser);
    }
  }

  getUsers() {
    this.apiService.get<any[]>('users', undefined, 'manager', `&page=${this.page}&sort=${this.sort}&search=`).subscribe({
      next: (res) => {
        this.users = res.data;
        this.pagination = res.pagination;
      },
      error: (err) => {
        this.addMessage('error', 'Error fetching users', 'Failed to retrieve user data.'); // Use addMessage
      }
    });
  }

  setUserImage(event: any) {
    const images = event.target.files;
    if (images.length) {
      this.uploadImage = images[0];
    }
  }

  delete(user: any) {
    if (user.role !== 'manager') {
      this.apiService.delete('users', user._id).subscribe({
        next: (res) => {
          this.getUsers();
          this.addMessage('success', 'User deleted', `User: ${user.name} deleted`); // Use addMessage
        },
        error: (err) => {
          this.addMessage('error', 'Error deleting user', 'Failed to delete user.'); // Use addMessage
        }
      });
    } else {
      this.addMessage('error', "You can't delete the Manager account", ''); // Use addMessage
    }
  }

  changePage(page: number) {
    this.page = page;
    this.getUsers();
  }

  updateUser(form: FormGroup) {
    const formData = new FormData();
    if (this.uploadImage) {
      formData.append('image', this.uploadImage);
    }
    Object.keys(this.editUserForm.controls).forEach(key => {
      formData.append(key, this.editUserForm.get(key)?.value);
    });

    this.apiService.update<any>('users', formData, this.selectedUser!._id).subscribe({
      next: (res) => {
        this.isEditing = false;
        this.selectedUser = null;
        this.addMessage('success', 'Updated User', 'User has been successfully updated.'); // Use addMessage
        this.getUsers();
      },
      error: (err) => {
        this.addMessage('error', 'Error updating user', 'Failed to update user.'); // Use addMessage
      }
    });
  }

  addUser(form: FormGroup) {
    const formData = new FormData();
    if (this.uploadImage) {
      formData.append('image', this.uploadImage);
    }
    Object.keys(this.addUserForm.controls).forEach(key => {
      formData.append(key, this.addUserForm.get(key)?.value);
    });
    this.apiService.post<any>('users', formData).subscribe({
      next: (res) => {
        this.isAdding = false;
        this.addMessage('success', 'Created User', 'User has been successfully created.'); // Use addMessage
        this.getUsers();
      },
      error: (err) => {
        this.addMessage('error', 'Error creating user', err.error.errors[0]?.msg || 'Failed to create user.'); // Use addMessage
      }
    });
  }

  toggleEditor(bool: boolean) {
    if (!this.selectedUser && bool) {
      this.addMessage('error', 'Select a user to update!', ''); // Use addMessage
    } else if (this.selectedUser?.role !== 'manager') {
      this.isEditing = bool;
    } else {
      this.addMessage('error', "You can't update the Manager account", ''); // Use addMessage
    }
  }

  toggleAddUserForm(bool: boolean) {
    this.isAdding = bool;
  }

  ngOnInit(): void {
    this.getUsers();
  }
}
