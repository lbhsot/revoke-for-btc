import { getViemChainConfig, ORDERED_CHAINS } from 'lib/utils/chains';
import { SECOND } from 'lib/utils/time';
import { ReactNode, useEffect, useMemo } from 'react';
import { configureChains, createConfig, useAccount, useConnect, WagmiConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
// import { LedgerConnector } from 'wagmi/connectors/ledger';
import { BitgetConnector, ConnectProvider, OKXConnector, UnisatConnector } from '@particle-network/btc-connectkit';
import { Merlin, MerlinTestnet } from '@particle-network/chains';
import { SafeConnector } from 'wagmi/connectors/safe';
import { publicProvider } from 'wagmi/providers/public';

interface Props {
  children: ReactNode;
}

const { chains: wagmiChains, publicClient } = configureChains(
  ORDERED_CHAINS.map(getViemChainConfig),
  [publicProvider()],
  // TODO: Fix cacheTime independent of pollingInterval
  { batch: { multicall: true }, pollingInterval: 4 * SECOND },
);

// We don't want to auto-disconnect the user when they switch to certain networks
// https://github.com/MetaMask/metamask-extension/issues/13375#issuecomment-1027663334
class InjectedConnectorNoDisconnectListener extends InjectedConnector {
  protected onDisconnect = async () => {};
}

export const connectors = [
  new SafeConnector({
    chains: wagmiChains,
    options: { debug: false },
  }),
  new InjectedConnectorNoDisconnectListener({ chains: wagmiChains }),
  new InjectedConnectorNoDisconnectListener({ chains: wagmiChains, options: { name: 'Browser Wallet' } }),
  // new WalletConnectConnector({
  //   chains: wagmiChains,
  //   options: {
  //     projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  //     metadata: {
  //       name: 'Revoke.cash',
  //       description:
  //         'Take back control of your wallet and stay safe by revoking token approvals and permissions you granted on Ethereum and over 70 other networks.',
  //       url: 'https://revoke.cash',
  //       icons: [
  //         'https://revoke.cash/assets/images/revoke-icon.svg',
  //         'https://revoke.cash/assets/images/apple-touch-icon.png',
  //       ],
  //     },
  //   },
  // }),
  new CoinbaseWalletConnector({ chains: wagmiChains, options: { appName: 'Revoke.cash' } }),
  // new LedgerConnector({
  //   chains: wagmiChains,
  //   options: { walletConnectVersion: 2, projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID },
  // }),
];

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const EthereumProvider = ({ children }: Props) => {
  const unisatConnector = useMemo(() => new UnisatConnector(), []);
  const okxConnector = useMemo(() => new OKXConnector(), []);
  const bitgetConnector = useMemo(() => new BitgetConnector(), []);
  return (
    <ConnectProvider
      options={{
        projectId: process.env.NEXT_PUBLIC_PARTICAL_PROJECT_ID, // ---
        clientKey: process.env.NEXT_PUBLIC_PARTICAL_CLIENT_KEY, // Retrieved from https://dashboard.particle.network
        appId: process.env.NEXT_PUBLIC_PARTICAL_APP_ID, // ---
        aaOptions: {
          accountContracts: {
            BTC: [
              {
                chainIds: [Merlin.id, MerlinTestnet.id], // The chain you'd like to use, Merlin in this case.
                version: '1.0.0', // Keep this as 1.0.0 for now.
              },
            ],
          },
        },
        walletOptions: {
          visible: true, // Whether or not the embedded wallet modal (for controlling the smart account) is shown.
        },
      }}
      // List of supported wallets.
      connectors={[unisatConnector, okxConnector, bitgetConnector]}
    >
      <WagmiConfig config={wagmiConfig}>
        <EthereumProviderChild>{children}</EthereumProviderChild>
      </WagmiConfig>
    </ConnectProvider>
  );
};

const EthereumProviderChild = ({ children }: Props) => {
  const { connect, connectors } = useConnect();
  const { connector } = useAccount();

  // If the Safe connector is available, connect to it even if other connectors are available
  // (if another connector auto-connects (or user disconnects), we still override it with the Safe connector)
  useEffect(() => {
    const safeConnector = connectors?.find((connector) => connector.id === 'safe' && connector.ready);
    if (!safeConnector || connector === safeConnector) return;
    connect({ connector: safeConnector });
  }, [connectors, connector]);

  return <>{children}</>;
};
