import { currencies } from '../../data';

interface HeaderProps {
  currencyToSell: string;
}

export function Header(props: HeaderProps) {
  const { currencyToSell } = props;
  return <h2 data-testid="title">{`Sell ${currencies[currencyToSell].id}`}</h2>;
}

export default Header;
