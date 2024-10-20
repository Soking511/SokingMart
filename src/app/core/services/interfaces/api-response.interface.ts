import { Products } from "../../../shared/interfaces/products";
import { Reviews } from "../../../shared/interfaces/reviews";

export interface ApiResponse<Interface> {
  items: never[];
  data: Interface;
  pagination: Object,
  categories: Object,
  subcategories: Object,
  Reviews: Reviews,
  message?: string;
  success: boolean;
  Products: Products,
}