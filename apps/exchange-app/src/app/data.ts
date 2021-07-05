import { Currency } from "./types";

export enum CurrencyKeys {
  eur = 'eur',
  usd = 'usd',
  gbp = 'gbp',
}

export enum InputType {
  from = 'from',
  to = 'to',
}

export const defaultFromInput = {
  currency: 'eur',
  value: '',
  isUsed: false,
};

export const defaultToInput = {
  currency: 'usd',
  value: '',
  isUsed: false,
};

export const currencies = {
  [CurrencyKeys.eur]: { 
    id: 'EUR', 
    key: CurrencyKeys.eur, 
    name: 'euro' 
  },
  [CurrencyKeys.usd]: {
    id: 'USD',
    key: CurrencyKeys.usd,
    name: 'american dollar',
  },
  [CurrencyKeys.gbp]: {
    id: 'GBP',
    key: CurrencyKeys.gbp,
    name: 'british pound sterling',
  },
} as Currency;


export const currencyIDs = Object.values(currencies).map((curr) => curr.id);

export const initialWallet = {
  [CurrencyKeys.eur]: 1000,
  [CurrencyKeys.usd]: 1000,
  [CurrencyKeys.gbp]: 1000,
};
