// Validation simple des données envoyées par l'admin (serveur)
import type { StoreWeightOption } from '@/types/store.types';

export const str = (v: unknown, max = 500): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export const num = (v: unknown): number | null => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

export const strList = (v: unknown, max = 20): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.length > 0).slice(0, max) : [];

export const weightList = (v: unknown): StoreWeightOption[] => {
  if (!Array.isArray(v)) return [];
  const out: StoreWeightOption[] = [];
  for (const row of v) {
    const weight = str(row?.weight, 40);
    const price = num(row?.price);
    if (weight && price !== null && price >= 0) out.push({ weight, price });
  }
  return out;
};

export const recordStr = (v: unknown): Record<string, string> | undefined => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return undefined;
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (typeof val === 'string' && k.trim()) out[k.trim().slice(0, 60)] = val.slice(0, 200);
  }
  return Object.keys(out).length ? out : undefined;
};
