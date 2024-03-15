import { useBTCProvider, useConnectModal, useETHProvider } from '@particle-network/btc-connectkit';
import { useMemo } from 'react';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { getChainById } from '../../utils/chains';
import { useIsBtcWallet } from './useIsBtcWallet';

export const useConnectInfo = () => {
  const { address: evmAddress } = useAccount();
  const { switchNetwork: switchEvmNetwork } = useSwitchNetwork();
  const { chain: evmWalletChain } = useNetwork();
  const { accounts: btcAccounts, provider: btcWalletProvider } = useBTCProvider();
  const {
    chainId: btcWalletChain,
    switchChain: switchBtcChain,
    evmAccount: btcEvmAccount,
    provider: ethWalletProvider,
  } = useETHProvider();
  const { disconnect: evmDisconnect } = useDisconnect();
  const { disconnect: btcDisconnect } = useConnectModal();
  const isBtcWallet = useIsBtcWallet();

  const account = useMemo(() => {
    return isBtcWallet ? btcAccounts[0] : evmAddress;
  }, [isBtcWallet, btcAccounts, evmAddress]);
  const switchNetwork = useMemo(() => {
    if (isBtcWallet) {
      return switchBtcChain;
    }
    return switchEvmNetwork;
  }, [isBtcWallet, switchBtcChain, switchEvmNetwork]);
  const chain = useMemo(() => {
    if (isBtcWallet) {
      return btcWalletChain ? getChainById(btcWalletChain) : undefined;
    }
    return evmWalletChain;
  }, [isBtcWallet, btcWalletChain, evmWalletChain]);
  const chainId = useMemo(() => {
    return chain?.id;
  }, [chain]);
  const disconnect = useMemo(() => {
    if (isBtcWallet) {
      return btcDisconnect;
    }
    return evmDisconnect;
  }, [isBtcWallet, btcDisconnect, evmDisconnect]);
  return {
    account,
    switchNetwork,
    chain,
    chainId,
    isBtcWallet,
    btcEvmAccount,
    disconnect,
    btcWalletProvider,
    ethWalletProvider,
  };
};
