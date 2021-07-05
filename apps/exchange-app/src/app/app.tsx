/*eslint no-prototype-builtins: 0*/

import styles from './app.module.scss';
import { Header } from './components/header/Header';
import { ExchangeInput } from './components/exchangeInput/exchangeInput';
import { ExchangeButton } from './components/exchangeButton/exchangeButton';
import { useExchangeRates } from './hooks/useExchangeRates';
import { useEffect, useState, useCallback } from 'react';
import { initialWallet, currencies } from './data';

const exchangeRatesRefreshRate = 3000;

interface Wallet {
  [index: string]: number;
}

export interface Input {
  currency: string;
  isUsed: boolean;
  value: number | string;
}

const defaultFromInput = {
  currency: 'eur',
  value: '',
  isUsed: false,
};

const defaultToInput = {
  currency: 'usd',
  value: '',
  isUsed: false,
};

export function App() {
  const [exchangeRates] = useExchangeRates(exchangeRatesRefreshRate);
  const [wallet, setWallet] = useState<Wallet>(initialWallet);
  const [fromInput, setFromInput] = useState<Input>(defaultFromInput);
  const [toInput, setToInput] = useState<Input>(defaultToInput);

  const fromCurrencyRate = exchangeRates[currencies[fromInput.currency].id];
  const toCurrencyRate = exchangeRates[currencies[toInput.currency].id];

  const calcFromInputNewValue = useCallback(() => {
    return +((+toInput.value * toCurrencyRate) / fromCurrencyRate).toFixed(2);
  }, [fromCurrencyRate, toCurrencyRate, toInput.value]);

  const calcToInputNewValue = useCallback(() => {
    return +((+fromInput.value * fromCurrencyRate) / toCurrencyRate).toFixed(2);
  }, [fromCurrencyRate, toCurrencyRate, fromInput.value]);

  useEffect(() => {
    if (fromInput.isUsed) {
      setToInput({ ...toInput, value: calcToInputNewValue() });
    } else if (toInput.isUsed) {
      setFromInput({
        ...fromInput,
        value: calcFromInputNewValue(),
      });
    }
  }, [exchangeRates, calcFromInputNewValue, calcToInputNewValue]);

  const updateInput = useCallback(
    (inputType) =>
      (ownValues: Partial<Input>, otherValues: Partial<Input> = {}) => {
        if (ownValues.hasOwnProperty('currency')) {
          if (inputType === 'from') {
            setToInput({
              ...defaultToInput,
              currency:
                ownValues.currency === toInput.currency
                  ? fromInput.currency
                  : toInput.currency,
            });
            setFromInput({
              ...defaultFromInput,
              currency: ownValues.currency ?? '',
            });
          } else {
            setFromInput({
              ...defaultFromInput,
              currency:
                ownValues.currency === fromInput.currency
                  ? toInput.currency
                  : fromInput.currency,
            });
            setToInput({
              ...defaultToInput,
              currency: ownValues.currency ?? '',
            });
          }
          return;
        }

        if (inputType === 'from') {
          setFromInput({ ...fromInput, ...ownValues });
          const newOtherValues = ownValues.hasOwnProperty('value')
            ? { ...otherValues, value: calcToInputNewValue() }
            : otherValues;
          setToInput({ ...toInput, ...newOtherValues });
        } else {
          setToInput({ ...toInput, ...ownValues });
          const newOtherValues = ownValues.hasOwnProperty('value')
            ? { ...otherValues, value: calcFromInputNewValue() }
            : otherValues;
          setFromInput({ ...fromInput, ...newOtherValues });
        }
      },
    [fromInput, toInput, calcFromInputNewValue, calcToInputNewValue]
  );

  const exchangeCurrencies = useCallback(() => {
    const currencyToAdd = currencies[toInput.currency].key;
    const currencyToRemove = currencies[fromInput.currency].key;

    const newWallet = {
      ...wallet,
      [currencyToAdd]: +(+wallet[currencyToAdd] + +toInput.value).toFixed(2),
      [currencyToRemove]: +(
        +wallet[currencyToRemove] - +fromInput.value
      ).toFixed(2),
    };

    setWallet(newWallet);
  }, [toInput, fromInput, wallet]);

  const exchangeBtnDisabled =
    +fromInput.value > wallet[currencies[fromInput.currency].key] ||
    +fromInput.value <= 0;

  return (
    <div className={styles.app}>
      <Header currencyToSell={fromInput.currency} />
      <ExchangeInput
        updateInput={updateInput('from')}
        data={fromInput}
        balance={wallet[fromInput.currency]}
        sign="-"
      />
      <ExchangeInput
        updateInput={updateInput('to')}
        data={toInput}
        balance={wallet[toInput.currency]}
        sign="+"
      />
      <ExchangeButton
        onClick={exchangeCurrencies}
        disabled={exchangeBtnDisabled}
        currencyToSell={fromInput.currency}
        currencyToBuy={toInput.currency}
      />
    </div>
  );
}

export default App;
