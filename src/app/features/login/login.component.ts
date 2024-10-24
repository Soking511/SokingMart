import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ToastModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  invalidLogin: string= '';

  loginForm = new FormGroup({
    email:  new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
  });

  constructor(
    private _MessageService:MessageService,
    private _AuthService:AuthService,
    private _Router:Router
  ){ }


  login(formData:FormGroup){
    this._AuthService.login(formData.value).subscribe({
      next:(res) => {
        localStorage.setItem('user', res.token );
        this._AuthService.saveCurrentUser();
        this._MessageService.add({severity:'success', detail:`Welcome Back`});
        this._Router.navigate(['/home']);
      },
      error:(err) => {
        this._MessageService.add({severity:'error', detail:err.error.message});
      }
    })
  }
  ngOnInit(): void {

  }
}
