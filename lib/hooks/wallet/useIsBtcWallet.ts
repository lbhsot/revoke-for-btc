import { useBTCProvider } from '@particle-network/btc-connectkit';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

export const useIsBtcWallet = () => {
  const { address: evmAddress } = useAccount();
  const { accounts: btcAccounts } = useBTCProvider();
  return useMemo(() => {
    if (evmAddress) return false;
    return btcAccounts.length > 0;
  }, [evmAddress, btcAccounts]);
};
