import DropdownMenu, { DropdownMenuItem } from 'components/common/DropdownMenu';
import { useNameLookup } from 'lib/hooks/ethereum/useNameLookup';
import { shortenAddress } from 'lib/utils/formatting';
import useTranslation from 'next-translate/useTranslation';
import { useConnectInfo } from '../../lib/hooks/wallet/useConnectInfo';
import ConnectButton from './ConnectButton';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'none';
  style?: 'primary' | 'secondary' | 'tertiary' | 'none';
  className?: string;
}

const WalletIndicatorDropdown = ({ size, style, className }: Props) => {
  const { t } = useTranslation();
  const { account, btcEvmAccount, disconnect, isBtcWallet } = useConnectInfo();
  const { ensName, unsName, avvyName } = useNameLookup(isBtcWallet ? (account as `0x${string}`) : undefined);
  const domainName = ensName ?? unsName ?? avvyName;

  return (
    <div className="flex whitespace-nowrap">
      {account ? (
        <DropdownMenu menuButton={domainName ?? shortenAddress(account, 4)}>
          <DropdownMenuItem href={`/address/${isBtcWallet ? btcEvmAccount : account}`} router>
            {isBtcWallet ? 'Smart Wallet Allowance: ' : t('common:buttons.my_allowances')}
            {isBtcWallet ? shortenAddress(btcEvmAccount, 4) : null}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => disconnect()}>{t('common:buttons.disconnect')}</DropdownMenuItem>
        </DropdownMenu>
      ) : (
        <ConnectButton size={size} style={style} className={className} redirect />
      )}
    </div>
  );
};

export default WalletIndicatorDropdown;
