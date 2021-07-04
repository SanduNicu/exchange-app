/*eslint no-prototype-builtins: 0*/

import styles from './app.module.scss';
import { Header } from './components/header/Header';
import { ExchangeInput } from './components/exchangeInput/exchangeInput';
import { ExchangeButton } from './components/exchangeButton/exchangeButton';
import { useExchangeRates } from './hooks/useExchangeRates';
import { useEffect, useState, useCallback } from 'react';
import { initialWallet, currencies } from './data';

const exchangeRatesRefreshRate = 5000;

interface Wallet {
  [index: string]: number;
}

interface Input {
  currency: string;
  isUsed: boolean;
  value: number | string;
  computedValue: number | string;
}

const defaultFromInput = {
  currency: 'eur',
  value: '',
  isUsed: false,
  computedValue: '',
};

const defaultToInput = {
  currency: 'usd',
  value: '',
  isUsed: false,
  computedValue: '',
};

export function App() {
  const [exchangeRates] = useExchangeRates(exchangeRatesRefreshRate);
  const [wallet, setWallet] = useState<Wallet>(initialWallet);
  const [fromInput, setFromInput] = useState<Input>(defaultFromInput);
  const [toInput, setToInput] = useState<Input>(defaultToInput);

  const fromCurrencyRate = exchangeRates[currencies[fromInput.currency].id];
  const toCurrencyRate = exchangeRates[currencies[toInput.currency].id];

  const calcFromInputComputedValue = useCallback(() => {
    return +((+toInput.value * toCurrencyRate) / fromCurrencyRate).toFixed(2);
  }, [fromCurrencyRate, toCurrencyRate, toInput.value]);

  const calcToInputComputedValue = useCallback(() => {
    return +((+fromInput.value * fromCurrencyRate) / toCurrencyRate).toFixed(2);
  }, [fromCurrencyRate, toCurrencyRate, fromInput.value]);

  useEffect(() => {
    if (fromInput.isUsed) {
      setToInput({ ...toInput, computedValue: calcToInputComputedValue() });
    } else if (toInput.isUsed) {
      setFromInput({
        ...fromInput,
        computedValue: calcFromInputComputedValue(),
      });
    }
  }, [exchangeRates, calcFromInputComputedValue, calcToInputComputedValue]);

  const updateInput = useCallback(
    (inputType) => (ownValues, otherValues) => {
      if (ownValues.hasOwnProperty('currency')) {
        if (inputType === 'from') {
          setToInput({
            ...defaultToInput,
            currency:
              ownValues.currency === toInput.currency
                ? fromInput.currency
                : toInput.currency,
          });
          setFromInput({ ...defaultFromInput, currency: ownValues.currency });
        } else {
          setFromInput({
            ...defaultFromInput,
            currency:
              ownValues.currency === fromInput.currency
                ? toInput.currency
                : fromInput.currency,
          });
          setToInput({ ...defaultToInput, currency: ownValues.currency });
        }
        return;
      }

      if (inputType === 'from') {
        setFromInput({ ...fromInput, ...ownValues });
        setToInput({ ...toInput, ...otherValues });
        const x = ownValues.hasOwnProperty('value')
          ? { ...otherValues, computedValue: calcToInputComputedValue() }
          : otherValues;
        setToInput({ ...toInput, ...x });
      } else {
        setToInput({ ...toInput, ...ownValues });
        setFromInput({ ...fromInput, ...otherValues });
        const x = ownValues.hasOwnProperty('value')
          ? { ...otherValues, computedValue: calcFromInputComputedValue() }
          : otherValues;
        setFromInput({ ...fromInput, ...x });
      }
    },
    [fromInput, toInput, calcFromInputComputedValue, calcToInputComputedValue]
  );

  const exchangeCurrencies = useCallback(() => {
    const currencyToAdd = currencies[toInput.currency].key;
    const currencyToRemove = currencies[fromInput.currency].key;

    const valueToAdd = toInput.isUsed ? toInput.value : toInput.computedValue;
    const valueToRemove = fromInput.isUsed
      ? fromInput.value
      : fromInput.computedValue;

    const newWallet = {
      ...wallet,
      [currencyToAdd]: +(+wallet[currencyToAdd] + +valueToAdd).toFixed(2),
      [currencyToRemove]: +(+wallet[currencyToRemove] - +valueToRemove).toFixed(
        2
      ),
    };

    setWallet(newWallet);
  }, [toInput, fromInput, wallet]);

  const exchangeBtnDisabled = fromInput.isUsed
    ? +fromInput.value > +wallet[currencies[fromInput.currency].key]
    : +fromInput.computedValue > +wallet[currencies[fromInput.currency].key];

  return (
    <div className={styles.app}>
      <Header sellCurrency={fromInput.currency} />
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
        sellCurrency={fromInput.currency}
        buyCurrency={toInput.currency}
      />
    </div>
  );
}

export default App;
