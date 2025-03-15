export interface ShippingCalculateRequest {
  from: {
    postal_code: string;
  };
  to: {
    postal_code: string;
  };
  products: Array<{
    id?: string;
    width: number;
    height: number;
    length: number;
    weight: number;
    insurance_value: number;
    quantity: number;
  }>;
}

export interface ShippingService {
  id: number;
  name: string;
  price: number;
  custom_price?: number;
  discount: number;
  currency: string;
  delivery_time: number;
  delivery_range: {
    min: number;
    max: number;
  };
  custom_delivery_time?: number;
  custom_delivery_range?: {
    min: number;
    max: number;
  };
  packages: any[];
  company: {
    id: number;
    name: string;
    picture: string;
  };
  error?: string;
}
