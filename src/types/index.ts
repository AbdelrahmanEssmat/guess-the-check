export interface Session {
  id: string;
  restaurantName?: string;
  date: string;
  people: Person[];
  tax: ChargeConfig;
  service: ChargeConfig;
  receiptTotal?: number;
}

export interface Person {
  id: string;
  name: string;
  color: string;
  items: Item[];
}

export interface Item {
  id: string;
  name: string;
  price: number;
  splitBetween: string[];
}

export interface ChargeConfig {
  type: 'percentage' | 'fixed';
  value: number;
}

export interface PersonSummary {
  person: Person;
  subtotal: number;
  taxAmount: number;
  serviceAmount: number;
  total: number;
  items: { name: string; amount: number }[];
}
