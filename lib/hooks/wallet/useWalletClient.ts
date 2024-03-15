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
  const { publicClient, provider } = useETHProvider();
  const { chain: connectedChain, isBtcWallet } = useConnectInfo();
  const chain = useMemo(() => {
    if (params?.chainId) {
      return getChainById(params?.chainId);
    }
    return connectedChain;
  }, [params?.chainId, connectedChain]);
  const btcPublicClient = useMemo(() => {
    let rpcDomain = 'https://rpc.particle.network';
    // if (typeof window !== 'undefined' && (window as any).__PARTICLE_ENVIRONMENT__ === 'development') {
    //   rpcDomain = 'https://rpc-debug.particle.network';
    // }
    return createPublicClient({
      chain,
      transport: http(
        `${rpcDomain}/evm-chain?chainId=${params?.chainId || chain?.id}&projectUuid=${
          process.env.NEXT_PUBLIC_PARTICAL_PROJECT_ID
        }&projectKey=${process.env.NEXT_PUBLIC_PARTICAL_CLIENT_KEY}`,
      ),
    });
  }, [chain, publicClient]);
  return useMemo(() => {
    return isBtcWallet ? btcPublicClient : evmPublicClient;
  }, [isBtcWallet, btcPublicClient, evmPublicClient]);
};
