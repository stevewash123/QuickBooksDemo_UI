export enum CustomerType {
  Residential = 'Residential',
  Commercial = 'Commercial'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  customerType: CustomerType;
  notes?: string;
}