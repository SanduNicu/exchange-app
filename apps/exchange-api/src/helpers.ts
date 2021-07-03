const staticRates = {
  EUR: 4.9269,
  USD: 4.166,
  GBP: 5.7313,
};

const deviation = 0.01;
const max = 1 + deviation;
const min = 1 - deviation;

export const randomiseRates = () => {
  return Object.keys(staticRates).reduce(
    (acc, val) => ({
      ...acc,
      [val]: staticRates[val] * (Math.random() * (max - min) + min),
    }),
    {}
  );
};
