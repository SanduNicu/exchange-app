import { useEffect, useState } from 'react';

const fetchExchange = async () => {
  return await fetch('http://localhost:3333/exchange', {
    method: 'GET',
  }).then(res => res.json());
};

export function useExchangeRates(refreshRate: number) {
  const [exchangeRates, setExchangeRates] = useState([]);
  const updateRates = async () => {
    try {
      const rates = await fetchExchange();
      setExchangeRates(rates);
    } catch (e) {
      setExchangeRates([]);
    }
  };
  useEffect(() => {
    updateRates();
    const interval = setInterval(() => {
      updateRates();
    }, refreshRate);

    return () => {
      clearInterval(interval);
    };
  }, [refreshRate]);

  return [exchangeRates];
}
