import { currencies } from '../../data';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import styles from './exchangeInput.module.scss';
import { Input } from '../../app';

interface ExchangeInputProps {
  updateInput(ownVals: Partial<Input>, vals?: Partial<Input>): void;
  data: Input;
  balance: number;
  sign: '+' | '-';
}
export function ExchangeInput(props: ExchangeInputProps) {
  const {
    data: { currency, value },
    balance,
    updateInput,
    sign,
  } = props;

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputs}>
        <Select
          className={styles.select}
          onChange={(ev) =>
            updateInput({ currency: ev.target.value as string })
          }
          value={currency}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {Object.values(currencies).map((curr) => (
            <MenuItem key={curr.key} value={curr.key}>
              {curr.id}
            </MenuItem>
          ))}
        </Select>
        {value > 0 && <span>{sign}</span>}
        <TextField
          placeholder="0"
          className={styles.textField}
          type="number"
          value={value}
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
