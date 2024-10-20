import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})

export class AddressService {
  currentUserAddress: any = {};
  state = [];
  loading = false;

  constructor(
    private _ApiService:ApiService,
    private _AuthService:AuthService,
  ){ }



  ngOnInit() {
    // this.getUserAddress();
  }
}
