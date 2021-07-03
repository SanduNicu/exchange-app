export enum currencyKeys {
  eur = 'eur',
  usd = 'usd',
  gbp = 'gbp',
}


interface Currency {
  [index: string]: any;
}

export const currencies = {
  [currencyKeys.eur]: { 
    id: 'EUR', 
    key: currencyKeys.eur, 
    name: 'euro' 
  },
  [currencyKeys.usd]: {
    id: 'USD',
    key: currencyKeys.usd,
    name: 'american dollar',
  },
  [currencyKeys.gbp]: {
    id: 'GBP',
    key: currencyKeys.gbp,
    name: 'british pound sterling',
  },
} as Currency;


export const currencyIDs = Object.values(currencies).map((curr) => curr.id);

export const initialWallet = {
  [currencyKeys.eur]: 1000,
  [currencyKeys.usd]: 1000,
  [currencyKeys.gbp]: 1000,
};
