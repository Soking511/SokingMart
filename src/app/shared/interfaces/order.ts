import { Products } from "./products";
import { UserAddress, Users } from "./uesrs";

export interface IItems {
  _id: string;
  product: Products;
  quantity?: number;
  price?: number;
}

export interface Cart {
  _id?: string;
  items?: IItems[];
}

export interface Order {
  items?: IItems;
  totalPrice?: number;
  paymentMethod?: string;
  deliveredAt?: Date | number;
  isDelivered?: boolean;
  paidAt?: Date | number;
  isPaid?: boolean;
  taxPrice?: number;
  address?: UserAddress;
  user?: Users;
}

export interface Orders {
createdAt: string|number|Date;
totalPrice: string|number;
price: string|number;
updatedAt: any;
_id: any;
  order: Order[];
}