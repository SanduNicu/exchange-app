import Button from '@material-ui/core/Button';
import { currencies } from '../../data';

export function ExchangeButton(props) {
  const { onClick, disabled, sellCurrency, buyCurrency } = props;
  const label = `Sell ${currencies[sellCurrency].id} for ${currencies[buyCurrency].id}`;
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
