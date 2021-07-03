import styles from './app.module.scss';
import { Header } from './components/header/Header';
import { Account } from './components/account/Account';
import { useExchangeRates } from './hooks/useExchangeRates';
import { useEffect, useState, useCallback } from 'react';
import { initialWallet, currencies } from './data';

interface Wallet {
  [index: string]: number;
}

const defaultFromInput = {
  currency: 'eur',
  value: '',
  isUsed: true,
  computedValue: 0,
};

const defaultToInput = {
  currency: 'usd',
  value: '',
  isUsed: false,
  computedValue: 0,
};

export function App() {
  const [exchangeRates] = useExchangeRates();
  const [wallet, setWallet] = useState<Wallet>(initialWallet);
  const [fromInput, setFromInput] = useState(defaultFromInput);
  const [toInput, setToInput] = useState(defaultToInput);

  const fromCurrencyRate = exchangeRates[currencies[fromInput.currency].id];
  const toCurrencyRate = exchangeRates[currencies[toInput.currency].id];

  const calcFromInputComputedValue = useCallback(() => {
    return (toInput.value * toCurrencyRate) / fromCurrencyRate;
  }, [fromCurrencyRate, toCurrencyRate, toInput.value]);

  const calcToInputComputedValue = useCallback(() => {
    return (fromInput.value * fromCurrencyRate) / toCurrencyRate;
  }, [fromCurrencyRate, toCurrencyRate, fromInput.value]);

  useEffect(() => {
    if (fromInput.isUsed) {
      setToInput({ ...toInput, computedValue: calcToInputComputedValue() });
    } else {
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
