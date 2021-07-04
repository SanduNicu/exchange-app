import { currencies } from '../../data';

export function Header(props) {
  const { sellCurrency } = props;
  return <div>{`Sell ${currencies[sellCurrency].id}`}</div>;
}

export default Header;
