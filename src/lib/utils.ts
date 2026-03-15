import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const moneyFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});

const moneyCompactFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  maximumFractionDigits: 0,
});

export const formatMoney = (amount: number): string =>
  moneyFormatter.format(amount);

export const formatMoneyCompact = (amount: number): string =>
  moneyCompactFormatter.format(amount);

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugSchema = z
  .string()
  .min(2, 'Slug must be at least 2 characters')
  .regex(
    SLUG_REGEX,
    'Slug must contain only lowercase letters, numbers, and hyphens',
  )
  .optional()
  .or(z.literal(''));

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const priceSchema = z
  .string()
  .min(1, 'Price is required')
  .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid amount (e.g. 10.99)');
