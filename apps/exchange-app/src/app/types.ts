export interface Wallet {
  [index: string]: number;
}

export interface Input {
  currency: string;
  isUsed: boolean;
  value: number | string;
}

export interface Currency {
  [index: string]: any;
}

