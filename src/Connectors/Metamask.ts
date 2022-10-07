import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

const [metaMask, hooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask(actions)
);
export const {
  useIsActive,
  useProvider,
  useChainId,
  useIsActivating,
  useAccount,
} = hooks;

export { metaMask };
