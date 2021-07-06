import { currencies } from '../../data';

interface HeaderProps {
  currencyToSell: string;
}

export function Header(props: HeaderProps) {
  const { currencyToSell } = props;
  return (
    <div data-testid="title">{`Sell ${currencies[currencyToSell].id}`}</div>
  );
}

export default Header;
