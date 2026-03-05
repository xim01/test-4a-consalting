import { Tariff } from "app/types/tariff";

export function safeParseTariffs(raw: string): Tariff[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Не удалось распарсить тарифы из строки:", err);
    return [];
  }
}
