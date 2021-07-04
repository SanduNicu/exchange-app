import { currencies, currencyIDs, currencyKeys } from '../../data';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import * as styles from './exchangeInput.module.scss';

export function ExchangeInput(props) {
  const {
    data: { currency, value, computedValue, isUsed },
    balance,
    updateInput,
    sign,
  } = props;
  const inputValue = isUsed ? value : computedValue;

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputs}>
        <Select
          onChange={(ev) => updateInput({ currency: ev.target.value })}
          value={currency}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {Object.values(currencies).map((curr) => (
            <MenuItem key={curr.key} value={curr.key}>
              {curr.id}
            </MenuItem>
          ))}
        </Select>
        {inputValue > 0 && <span>{sign}</span>}
        <TextField
          placeholder="0"
          type="number"
          value={inputValue}
          onChange={(ev) =>
            updateInput(
              { value: ev.target.value, isUsed: true },
              { isUsed: false }
            )
          }
        />
      </div>
      <span>Balance: {balance}</span>
    </div>
  );
}

export default ExchangeInput;
