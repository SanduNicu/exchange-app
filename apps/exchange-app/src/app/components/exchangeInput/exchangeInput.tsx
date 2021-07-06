import { currencies } from '../../data';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import styles from './exchangeInput.module.scss';
import { Input } from '../../types';

interface ExchangeInputProps {
  updateInputCurrency(currency: string): void;
  updateInputValue(value: number): void;
  data: Input;
  calculatedValue: number | '';
  balance: number;
  sign: '+' | '-';
  selectDataTestId: string;
  inputDataTestId: string;
}
export function ExchangeInput(props: ExchangeInputProps) {
  const {
    data: { currency, value, isUsed },
    balance,
    calculatedValue,
    updateInputCurrency,
    updateInputValue,
    selectDataTestId,
    inputDataTestId,
    sign,
  } = props;

  const inputValue = isUsed ? value : calculatedValue;

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputs}>
        <Select
          className={styles.select}
          onChange={(ev) => updateInputCurrency(ev.target.value as string)}
          value={currency}
          inputProps={{ 'aria-label': 'Without label' }}
          data-testid={selectDataTestId}
        >
          {Object.values(currencies).map((curr) => (
            <MenuItem
              key={curr.key}
              data-testid={`currency-${curr.key}`}
              value={curr.key}
            >
              {curr.id}
            </MenuItem>
          ))}
        </Select>
        {inputValue > 0 && <span>{sign}</span>}
        <TextField
          inputProps={{ 'data-testid': inputDataTestId }}
          placeholder="0"
          className={styles.textField}
          type="number"
          value={inputValue}
          onChange={(ev) => updateInputValue(+(+ev.target.value).toFixed(2))}
        />
      </div>
      <span>Balance: {balance}</span>
    </div>
  );
}

export default ExchangeInput;
