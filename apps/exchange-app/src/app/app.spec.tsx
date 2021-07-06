import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  const fromInput = screen.getByTestId(
    'from-currency-input'
  ) as HTMLInputElement;
  const toInput = screen.getByTestId('to-currency-input') as HTMLInputElement;

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
    changeSelectValue,
    changeInputValue,
    fromInput,
    toInput,
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
    const { changeSelectValue, fromSelect, toSelect } = renderApp();
    changeSelectValue('from', 'GBP');
    expect(within(fromSelect).getByText('GBP')).toBeTruthy();
    changeSelectValue('from', 'USD');
    expect(within(fromSelect).getByText('USD')).toBeTruthy();

    changeSelectValue('to', 'GBP');
    expect(within(toSelect).getByText('GBP')).toBeTruthy();
    changeSelectValue('to', 'USD');
    expect(within(toSelect).getByText('USD')).toBeTruthy();
  });

  it('should change currency ammount', () => {
    const { changeInputValue, fromInput, toInput } = renderApp();
    const newValue = '123';
    changeInputValue('from', newValue);
    expect(fromInput.value).toEqual(newValue);

    changeInputValue('to', newValue);
    expect(toInput.value).toEqual(newValue);
  });
});
