import WithHoverTooltip from 'components/common/WithHoverTooltip';
import { getChainName } from 'lib/utils/chains';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { ReactElement } from 'react';
import { useAccount } from 'wagmi';
import { useConnectInfo } from '../../../lib/hooks/wallet/useConnectInfo';
import SwitchChainButton from './SwitchChainButton';

interface Props {
  chainId: number;
  address: string;
  switchChainSize?: 'sm' | 'md' | 'lg';
  children?: (disabled: boolean) => ReactElement;
  overrideDisabled?: boolean;
  disabledReason?: string;
}

const ControlsWrapper = ({ chainId, address, switchChainSize, children, overrideDisabled, disabledReason }: Props) => {
  const { t } = useTranslation();
  const { connector } = useAccount();
  const { chainId: currentChainId, account, isBtcWallet, btcEvmAccount } = useConnectInfo();

  const chainName = getChainName(chainId);

  const isConnected = !!account;
  const isConnectedAddress = isConnected && (isBtcWallet ? address === btcEvmAccount : address === account);
  const needsToSwitchChain = isConnected && chainId !== currentChainId;
  const canSwitchChain = isBtcWallet ? true : connector?.id === 'injected';
  const isChainSwitchEnabled = switchChainSize !== undefined;
  const shouldRenderSwitchChainButton = needsToSwitchChain && canSwitchChain && isChainSwitchEnabled;
  const disabled = !isConnectedAddress || (needsToSwitchChain && !shouldRenderSwitchChainButton) || overrideDisabled;

  if (shouldRenderSwitchChainButton) {
    return <SwitchChainButton chainId={chainId} size={switchChainSize} />;
  }

  if (!isConnected) {
    return <WithHoverTooltip tooltip={t('address:tooltips.connect_wallet')}>{children(disabled)}</WithHoverTooltip>;
  }

  if (!isConnectedAddress) {
    return <WithHoverTooltip tooltip={t('address:tooltips.connected_account')}>{children(disabled)}</WithHoverTooltip>;
  }

  if (needsToSwitchChain) {
    const tooltip = (
      <Trans i18nKey={`address:tooltips.switch_chain`} values={{ chainName }} components={[<strong />]} />
    );

    return <WithHoverTooltip tooltip={tooltip}>{children(disabled)}</WithHoverTooltip>;
  }

  if (overrideDisabled && disabledReason) {
    return <WithHoverTooltip tooltip={disabledReason}>{children(disabled)}</WithHoverTooltip>;
  }

  return <>{children(disabled)}</>;
};

export default ControlsWrapper;
