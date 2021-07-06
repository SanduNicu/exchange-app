import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './app';
import { mockedExchangeRates } from './mocks';

type SelectType = 'to' | 'from';
type Currency = 'EUR' | 'USD' | 'GBP';

jest.mock('./hooks/useExchangeRates', () => {
  return { useExchangeRates: jest.fn(() => [mockedExchangeRates]) };
});

function renderApp() {
  const wrapper = render(<App />);
  const title = screen.getByTestId('title');

  const fromSelect = screen.getByTestId('from-currency-select');
  const toSelect = screen.getByTestId('to-currency-select');
  const fromSelectDropdown = within(fromSelect).getByRole('button');
  const toSelectDropdown = within(toSelect).getByRole('button');
  const fromSelectInput = screen.getByTestId(
    'from-currency-select-input'
  ) as HTMLInputElement;
  const toSelectInput = screen.getByTestId(
    'to-currency-select-input'
  ) as HTMLInputElement;

  const fromInput = screen.getByTestId(
    'from-currency-input'
  ) as HTMLInputElement;
  const toInput = screen.getByTestId('to-currency-input') as HTMLInputElement;

  const fromBalance = screen.getByTestId('from-balance');
  const toBalance = screen.getByTestId('to-balance');

  const exchangeButton = screen.getByTestId('exchange-btn');

  function changeSelectValue(selectType: SelectType, currency: Currency) {
    if (selectType === 'from') {
      fireEvent.mouseDown(fromSelectDropdown);
    } else {
      fireEvent.mouseDown(toSelectDropdown);
    }
    const listBox = within(screen.getByRole('listbox'));
    userEvent.click(listBox.getByText(currency));
  }

  function changeInputValue(inputType: SelectType, value: string) {
    if (inputType === 'from') {
      fireEvent.change(fromInput, { target: { value } });
    } else {
      fireEvent.change(toInput, { target: { value } });
      return;
    }
  }

  return {
    wrapper,
    title,
    fromSelect,
    toSelect,
    fromSelectInput,
    toSelectInput,
    changeSelectValue,
    changeInputValue,
    fromInput,
    toInput,
    fromBalance,
    toBalance,
    exchangeButton,
  };
}

describe('App', () => {
  afterEach(jest.clearAllMocks);

  it('should render successfully', () => {
    const { wrapper } = renderApp();

    expect(wrapper.baseElement).toBeTruthy();
  });

  it('should display correct title', () => {
    const { title, changeSelectValue } = renderApp();

    expect(within(title).getByText('Sell EUR')).toBeTruthy();
    changeSelectValue('from', 'GBP');
    expect(within(title).getByText('Sell GBP')).toBeTruthy();
    changeSelectValue('from', 'USD');
    expect(within(title).getByText('Sell USD')).toBeTruthy();
  });

  it('should change selected currency', () => {
    const { changeSelectValue, fromSelectInput, toSelectInput } = renderApp();

    changeSelectValue('from', 'GBP');
    expect(fromSelectInput.value).toBe('gbp');
    changeSelectValue('from', 'USD');
    expect(fromSelectInput.value).toBe('usd');

    changeSelectValue('to', 'GBP');
    expect(toSelectInput.value).toBe('gbp');
    changeSelectValue('to', 'USD');
    expect(toSelectInput.value).toBe('usd');
  });

  it('should swap currency', () => {
    const { changeSelectValue, fromSelectInput, toSelectInput } = renderApp();

    changeSelectValue('from', 'USD');
    changeSelectValue('to', 'GBP');
    expect(fromSelectInput.value).toBe('usd');
    expect(toSelectInput.value).toBe('gbp');

    changeSelectValue('from', 'GBP');
    expect(fromSelectInput.value).toBe('gbp');
    expect(toSelectInput.value).toBe('usd');
  });

  it('should change currency ammount', () => {
    const { changeInputValue, fromInput, toInput } = renderApp();
    const newValue = '123';

    changeInputValue('from', newValue);
    expect(fromInput.value).toEqual(newValue);

    changeInputValue('to', newValue);
    expect(toInput.value).toEqual(newValue);
  });

  it('should display exchange button text', () => {
    const { changeSelectValue, exchangeButton } = renderApp();

    changeSelectValue('from', 'USD');
    changeSelectValue('to', 'GBP');
    expect(within(exchangeButton).getByText('Sell USD for GBP')).toBeTruthy();
  });

  it('should disable button for insufficient fonds', () => {
    const { changeInputValue, exchangeButton } = renderApp();

    changeInputValue('from', '100');
    expect(exchangeButton).not.toBeDisabled();
    changeInputValue('from', '10000');
    expect(exchangeButton).toBeDisabled();

    changeInputValue('from', '1');
    expect(exchangeButton).not.toBeDisabled();
    changeInputValue('to', '10000');
    expect(exchangeButton).toBeDisabled();
  });

  it('should calculate exchanged value', () => {
    const { changeSelectValue, changeInputValue, toInput, fromInput } =
      renderApp();

    changeSelectValue('from', 'USD');
    changeSelectValue('to', 'GBP');
    changeInputValue('from', '100');
    expect(toInput.value).toBe('72.69');
    changeInputValue('to', '300');
    expect(fromInput.value).toBe('412.72');
  });

  it('should exchange currency and update balance', () => {
    const {
      changeSelectValue,
      exchangeButton,
      fromBalance,
      toBalance,
      changeInputValue,
    } = renderApp();

    expect(fromBalance.innerHTML).toBe('Balance: 1000');
    expect(toBalance.innerHTML).toBe('Balance: 1000');

    changeSelectValue('from', 'USD');
    changeSelectValue('to', 'GBP');
    changeInputValue('from', '100');
    userEvent.click(exchangeButton);
  });
});
