export interface Address {
  id: string;
  user_id: string;
  name: string;
  recipient: string;
  zip_code: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  is_default: boolean;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface AddressFormData {
  name: string;
  recipient: string;
  zip_code: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  phone?: string;
  is_default?: boolean;
}

export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}
