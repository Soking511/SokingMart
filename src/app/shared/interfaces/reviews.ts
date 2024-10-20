import { Products } from "./products";
import { Users } from "./uesrs";

export interface Reviews {
  _id?: string;
  comment?: string;
  rate?: number;
  product?: Products;
  user?: Users;
  createdAt?: Date;
}

export interface ReviewsResponse {
  data: Reviews[];
}