import { useMemo } from 'react';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { usePublicClient as useBasePublicClient, useWalletClient as useBaseWalletClient } from 'wagmi';
import { getChainById } from '../../utils/chains';
import { useConnectInfo } from './useConnectInfo';

export const useWalletClient = () => {
  const { data: evmWalletClient } = useBaseWalletClient();
  const { chain, ethWalletProvider, isBtcWallet, btcEvmAccount } = useConnectInfo();
  const btcWalletClient = useMemo(() => {
    return createWalletClient({
      account: btcEvmAccount as `0x${string}`,
      chain,
      transport: ethWalletProvider ? custom(ethWalletProvider) : http(),
    });
  }, [btcEvmAccount, ethWalletProvider, chain]);
  return useMemo(() => {
    return isBtcWallet ? btcWalletClient : evmWalletClient;
  }, [isBtcWallet, btcWalletClient, evmWalletClient]);
};

export const usePublicClient = (params?: { chainId?: number }) => {
  const evmPublicClient = useBasePublicClient();
  const { chain: connectedChain, isBtcWallet } = useConnectInfo();
  const chain = useMemo(() => {
    if (params?.chainId) {
      return getChainById(params?.chainId);
    }
    return connectedChain;
  }, [params?.chainId, connectedChain]);
  const btcPublicClient = useMemo(() => {
    return createPublicClient({
      chain,
      transport: http(),
    });
  }, [chain]);
  return useMemo(() => {
    return isBtcWallet ? btcPublicClient : evmPublicClient;
  }, [isBtcWallet, btcPublicClient, evmPublicClient]);
};
