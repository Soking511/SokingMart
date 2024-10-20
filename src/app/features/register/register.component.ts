import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  messageError: string = '';

  registerForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
  })

  constructor(
    private _AuthService:AuthService,
    private _MessageService:MessageService,
    private _ApiService:ApiService,
    private _Router:Router
  ){ }

  addMessage = ( severity:string='success', summary:string='Service Message', detail:string='MessageService' ) => this._MessageService.add({severity, summary, detail});

  register(formData:FormGroup){
    this._AuthService.register(formData.value).subscribe({
      next:(res) => {
        localStorage.setItem('user', res.token);
        this._AuthService.saveCurrentUser();
        this._Router.navigate(['/home']);
      },
      error:(err) => {
        err.error.errors.map((error: any) => {
          if (error.path === 'email' || error.path === 'password' || error.path === 'phone')
            return this.addMessage('error', 'error', err.error.errors[0].msg);
          else

          return this.addMessage('error', 'error', 'Password must contain both uppercase and lowercase letters');

        })
      }
    })
  }
}
