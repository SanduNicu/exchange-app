import { useEffect, useState } from 'react';

const fetchExchange = async () => {
  return await fetch('http://localhost:3333/exchange', {
    method: 'GET',
  }).then(res => res.json());
};

export function useExchangeRates() {
  const [exchangeRates, setExchangeRates] = useState([]);
  const updateRates = async () => {
    const rates = await fetchExchange();
    setExchangeRates(rates);
  };
  useEffect(() => {
    updateRates();
    const interval = setInterval(() => {
      updateRates();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return [exchangeRates];
}
