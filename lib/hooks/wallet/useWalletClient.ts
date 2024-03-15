import { useETHProvider } from '@particle-network/btc-connectkit';
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
  const { publicClient } = useETHProvider();
  const { chain: connectedChain, isBtcWallet } = useConnectInfo();
  const chain = useMemo(() => {
    if (params?.chainId) {
      return getChainById(params?.chainId);
    }
    return connectedChain;
  }, [params?.chainId, connectedChain]);
  const btcPublicClient = useMemo(() => {
    if (!publicClient) return undefined;
    return createPublicClient({
      chain,
      // @ts-ignore
      transport: publicClient.transport,
    });
  }, [chain, publicClient]);
  return useMemo(() => {
    return isBtcWallet ? btcPublicClient : evmPublicClient;
  }, [isBtcWallet, btcPublicClient, evmPublicClient]);
};
