import { Address } from 'viem';
import { ChainId } from '@revoke.cash/chains';
import WalletHealth from './WalletHealth';
import AllowancesSummary from './AllowancesSummary';
import { twMerge } from 'tailwind-merge';

interface Props {
  address: Address;
  chainId: number;
}

const WalletHealthSection = ({ address, chainId }: Props) => {
  const classes = twMerge(
    'flex flex-col sm:flex-row justify-between gap-4 border border-black dark:border-white rounded-lg py-3 px-4',
    chainId !== ChainId.EthereumMainnet && 'justify-center',
  );

  return (
    <div className={classes}>
      <WalletHealth address={address} chainId={chainId} />
      <AllowancesSummary address={address} chainId={chainId} />
    </div>
  );
};

export default WalletHealthSection;
