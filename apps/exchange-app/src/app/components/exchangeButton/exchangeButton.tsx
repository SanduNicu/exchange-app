import Button from '@material-ui/core/Button';
import { currencies } from '../../data';

interface ExchangeButtonProps {
  onClick(): void;
  disabled: boolean;
  currencyToBuy: string;
  currencyToSell: string;
}

export function ExchangeButton(props: ExchangeButtonProps) {
  const { onClick, disabled, currencyToSell, currencyToBuy } = props;
  const label = `Sell ${currencies[currencyToSell].id} for ${currencies[currencyToBuy].id}`;
  return (
    <Button
      data-testid="exchange-btn"
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
