import { useMounted } from 'lib/hooks/useMounted';
import { useConnectInfo } from '../../lib/hooks/wallet/useConnectInfo';
import ChainSelect from '../common/select/ChainSelect';
import WalletIndicatorDropdown from './WalletIndicatorDropdown';

interface Props {
  menuAlign?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'none';
  style?: 'primary' | 'secondary' | 'tertiary' | 'none';
  className?: string;
}

const WalletIndicator = ({ menuAlign, size, style, className }: Props) => {
  const isMounted = useMounted();
  const { account, switchNetwork, chainId } = useConnectInfo();

  if (!isMounted) return null;

  return (
    <div className="flex gap-2">
      {account && chainId ? (
        <ChainSelect
          instanceId="global-chain-select"
          onSelect={switchNetwork}
          selected={chainId}
          menuAlign={menuAlign}
        />
      ) : null}
      <WalletIndicatorDropdown size={size} style={style} className={className} />
    </div>
  );
};

export default WalletIndicator;
