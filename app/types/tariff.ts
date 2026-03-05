// src/lib/types/tariff.ts
export interface Tariff {
  id: string;
  period: string;
  price: number;
  full_price: number;
  is_best: boolean;
  text: string;
}

export type TariffsResponse = Tariff[];
