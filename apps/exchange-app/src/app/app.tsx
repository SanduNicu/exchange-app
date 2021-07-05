import styles from './app.module.scss';
import { Header } from './components/header/Header';
import { ExchangeInput } from './components/exchangeInput/exchangeInput';
import { ExchangeButton } from './components/exchangeButton/exchangeButton';
import { useExchangeRates } from './hooks/useExchangeRates';
import { useState, useCallback } from 'react';
import {
  initialWallet,
  currencies,
  InputType,
  defaultFromInput,
  defaultToInput,
} from './data';
import { Input, Wallet } from './types';

const exchangeRatesRefreshRate = 3000;

export function App() {
  const [exchangeRates] = useExchangeRates(exchangeRatesRefreshRate);

  const [wallet, setWallet] = useState<Wallet>(initialWallet);
  const [fromInput, setFromInput] = useState<Input>(defaultFromInput);
  const [toInput, setToInput] = useState<Input>(defaultToInput);

  const fromCurrencyRate = exchangeRates[currencies[fromInput.currency].id];
  const toCurrencyRate = exchangeRates[currencies[toInput.currency].id];

  const fromInputCalculatedValue =
    +((+toInput.value * toCurrencyRate) / fromCurrencyRate).toFixed(2) || '';

  const toInputCalculatedValue =
    +((+fromInput.value * fromCurrencyRate) / toCurrencyRate).toFixed(2) || '';

  const updateInputCurrency = useCallback(
    (inputType) => (currency: string) => {
      if (inputType === InputType.from) {
        if (toInput.currency === currency) {
          setToInput({ ...toInput, value: '', currency: fromInput.currency });
        }
        setFromInput({ ...fromInput, value: '', currency });
      } else {
        if (fromInput.currency === currency) {
          setFromInput({ ...fromInput, value: '', currency: toInput.currency });
        }
        setToInput({ ...toInput, value: '', currency });
      }
    },
    [fromInput, toInput]
  );

  const updateInputValue = useCallback(
    (inputType) => (value: number | string) => {
      if (value === 0) value = '';

      if (inputType === InputType.from) {
        setFromInput({ ...fromInput, value, isUsed: true });
        setToInput({ ...toInput, isUsed: false });
      } else {
        setToInput({ ...toInput, value, isUsed: true });
        setFromInput({ ...fromInput, isUsed: false });
      }
    },
    [fromInput, toInput]
  );

  const exchangeCurrencies = useCallback(() => {
    const currencyToRemove = currencies[fromInput.currency].key;
    const currencyToAdd = currencies[toInput.currency].key;
    const valueToRemove = fromInput.isUsed
      ? fromInput.value
      : fromInputCalculatedValue;

    const valueToAdd = toInput.isUsed ? toInput.value : toInputCalculatedValue;

    const newWallet = {
      ...wallet,
      [currencyToAdd]: +(+wallet[currencyToAdd] + +valueToAdd).toFixed(2),
      [currencyToRemove]: +(+wallet[currencyToRemove] - +valueToRemove).toFixed(
        2
      ),
    };

    setWallet(newWallet);
  }, [
    toInput,
    fromInput,
    wallet,
    fromInputCalculatedValue,
    toInputCalculatedValue,
  ]);

  const exchangeBtnDisabled =
    (fromInput.isUsed ? +fromInput.value : fromInputCalculatedValue) >
    wallet[currencies[fromInput.currency].key];

  if (exchangeRates.length === 0) return null;

  return (
    <div className={styles.app}>
      <Header currencyToSell={fromInput.currency} />
      <ExchangeInput
        updateInputCurrency={updateInputCurrency(InputType.from)}
        updateInputValue={updateInputValue(InputType.from)}
        data={fromInput}
        balance={wallet[fromInput.currency]}
        calculatedValue={fromInputCalculatedValue}
        sign="-"
      />
      <ExchangeInput
        updateInputCurrency={updateInputCurrency(InputType.to)}
        updateInputValue={updateInputValue(InputType.to)}
        data={toInput}
        balance={wallet[toInput.currency]}
        calculatedValue={toInputCalculatedValue}
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
