import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface Address {
  _id?:string;
  street: string;
  postalCode: string;
  city: string;
  state: string;
}

export interface AddressForm {
  street?: FormControl<string | null>;
  postalCode?: FormControl<string | null>;
  city?: FormControl<string | null>;
  state?: FormControl<string | null>;
}

export interface City {
  code: string; // or whatever properties your city object has
  name: string;
}