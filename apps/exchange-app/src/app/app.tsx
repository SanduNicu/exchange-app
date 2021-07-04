/*eslint no-prototype-builtins: 0*/

import styles from './app.module.scss';
import { Header } from './components/header/Header';
import { Account } from './components/account/Account';
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
    return (
      (Number(toInput.value) * toCurrencyRate) /
      fromCurrencyRate
    ).toFixed(2);
  }, [fromCurrencyRate, toCurrencyRate, toInput.value]);

  const calcToInputComputedValue = useCallback(() => {
    return (
      (Number(fromInput.value) * fromCurrencyRate) /
      toCurrencyRate
    ).toFixed(2);
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
        setFromInput(defaultFromInput);
        setToInput(defaultToInput);
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

  return (
    <div className={styles.app}>
      <Header />
      <Account
        updateInput={updateInput('from')}
        data={fromInput}
        balance={wallet[fromInput.currency]}
      />
      <Account
        updateInput={updateInput('to')}
        data={toInput}
        balance={wallet[toInput.currency]}
      />
    </div>
  );
}

export default App;
