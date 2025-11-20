declare global {
  interface Inputs {
    _id?: string;
    menu: string;
    price: number;
    quantity: number;
    description: string;
    photo?: string;
    category_id: string;
  }
  interface Categories {
    _id?: string;
    name: string;
    photo?: string;
  }
  interface ApiResponse<T> {
    data: T;
    totalPages?: number;
    currentPage?: number;
  }
  export interface OrderItem {
    _id?: string;
    menu_id: { _id: string; menu: string };
    quantity: number;
    price: number;
    subtotal: number;
    menu?: string;
  }

  export interface Order {
    _id?: string;
    user_id: { _id: string; name: string };
    user_name?: string;
    items: OrderItem[];
    paymentMethod: string;
    status : string,
    deliveryType : string,
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  }


}
