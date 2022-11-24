import type { AddEthereumChainParameter } from "@web3-react/types";
import arbitrumNetworkIcon from "../imgs/logos/chains/arbitrum-network.jpg";
import auroraNetworkIcon from "../imgs/logos/chains/aurora-network.png";
import avalancheNetworkIcon from "../imgs/logos/chains/avalanche-network.jpg";
import bobaTokenIcon from "../imgs/logos/chains/boba-token.svg";
import bscNetworkIcon from "../imgs/logos/chains/bsc-network.jpg";
import celoNetworkIcon from "../imgs/logos/chains/celo-network.png";
import cronosNetworkIcon from "../imgs/logos/chains/cronos-network.jpg";
import fantomNetworkIcon from "../imgs/logos/chains/fantom-network.jpg";
import gnosisNetworkIcon from "../imgs/logos/chains/gnosis-chain-network.jpg";
import harmonyNetworkIcon from "../imgs/logos/chains/harmonyone-network.jpg";
import iotexNetworkIcon from "../imgs/logos/chains/iotex-network.png";
import metisNetworkIcon from "../imgs/logos/chains/metis-network.png";
import moonriverNetworkIcon from "../imgs/logos/chains/moonriver-network.jpg";
import polygonNetworkIcon from "../imgs/logos/chains/polygon-network.jpg";

const ETH: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
};

const MATIC: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18,
};

const AVAX: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Avalanche",
  symbol: "AVAX",
  decimals: 18,
};

const ONE: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Harmony",
  symbol: "ONE",
  decimals: 18,
};

const MOVR: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Moonriver",
  symbol: "MOVR",
  decimals: 18,
};

const CRO: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Cronos",
  symbol: "CRO",
  decimals: 18,
};

const BNB: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Binance Coin",
  symbol: "BNB",
  decimals: 18,
};

const XDAI: AddEthereumChainParameter["nativeCurrency"] = {
  name: "XDAI",
  symbol: "XDAI",
  decimals: 18,
};

const METIS: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Metis",
  symbol: "METIS",
  decimals: 18,
};
const IOTX: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Iotex",
  symbol: "IOTX",
  decimals: 18,
};

const CELO: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Celo",
  symbol: "CELO",
  decimals: 18,
};

const FTM: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Fantom",
  symbol: "FTM",
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter["nativeCurrency"];
  blockExplorerUrls: AddEthereumChainParameter["blockExplorerUrls"];
  iconUrls?: AddEthereumChainParameter["iconUrls"];
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

export function getAddChainParameters(
  chainId?: number
): AddEthereumChainParameter | undefined {
  if (chainId) {
    const chainInformation = CHAINS[chainId];
    if (isExtendedChainInformation(chainInformation)) {
      return {
        chainId,
        chainName: chainInformation.name,
        nativeCurrency: chainInformation.nativeCurrency,
        rpcUrls: chainInformation.urls,
        blockExplorerUrls: chainInformation.blockExplorerUrls,
        iconUrls: chainInformation.iconUrls,
      };
    }
  }
  return;
}

export const CHAINS: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation;
} = {
  1: { urls: ["https://cloudflare-eth.com"], name: "Mainnet" },
  25: {
    urls: ["https://evm-cronos.crypto.org"],
    name: "Cronos",
    nativeCurrency: CRO,
    blockExplorerUrls: ["https://cronos.org/explorer/"],
    iconUrls: [cronosNetworkIcon],
  },
  56: {
    urls: ["https://bsc-dataseed.binance.org/"],
    name: "BNB Chain",
    nativeCurrency: BNB,
    blockExplorerUrls: ["https://bscscan.com/"],
    iconUrls: [bscNetworkIcon],
  },
  100: {
    urls: ["https://rpc.ankr.com/gnosis"],
    name: "Gnosis Chain",
    nativeCurrency: XDAI,
    blockExplorerUrls: ["https://blockscout.com/xdai/mainnet/"],
    iconUrls: [gnosisNetworkIcon],
  },
  137: {
    urls: ["https://polygon-rpc.com"],
    name: "Polygon Mainnet",
    nativeCurrency: MATIC,
    blockExplorerUrls: ["https://polygonscan.com"],
    iconUrls: [polygonNetworkIcon],
  },
  250: {
    urls: ["https://rpc.ftm.tools/"],
    name: "Fantom",
    nativeCurrency: FTM,
    blockExplorerUrls: ["https://ftmscan.com/"],
    iconUrls: [fantomNetworkIcon],
  },
  288: {
    urls: ["https://mainnet.boba.network"],
    name: "Boba L2",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://blockexplorer.boba.network"],
    iconUrls: [bobaTokenIcon],
  },
  1088: {
    urls: ["https://andromeda.metis.io/?owner=1088"],
    name: "Metis Network",
    nativeCurrency: METIS,
    blockExplorerUrls: ["https://andromeda-explorer.metis.io/"],
    iconUrls: [metisNetworkIcon],
  },
  1285: {
    urls: ["https://rpc.api.moonriver.moonbeam.network"],
    name: "MoonRiver",
    nativeCurrency: MOVR,
    blockExplorerUrls: ["https://moonriver.moonscan.io/"],
    iconUrls: [moonriverNetworkIcon],
  },
  4689: {
    urls: ["https://babel-api.mainnet.iotex.io"],
    name: "IoTeX Mainnet",
    nativeCurrency: IOTX,
    blockExplorerUrls: ["https://iotexscan.io/"],
    iconUrls: [iotexNetworkIcon],
  },
  42161: {
    urls: ["https://arb1.arbitrum.io/rpc"],
    name: "Arbitrum One",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://arbiscan.io"],
    iconUrls: [arbitrumNetworkIcon],
  },
  42220: {
    urls: ["https://forno.celo.org"],
    name: "Celo (Mainnet)",
    nativeCurrency: CELO,
    blockExplorerUrls: ["https://explorer.celo.org"],
    iconUrls: [celoNetworkIcon],
  },
  43114: {
    urls: ["https://api.avax.network/ext/bc/C/rpc"],
    name: "Avalanche Mainnet C-Chain",
    nativeCurrency: AVAX,
    blockExplorerUrls: ["https://snowtrace.io/"],
    iconUrls: [avalancheNetworkIcon],
  },
  1313161554: {
    urls: ["https://mainnet.aurora.dev"],
    name: "Aurora",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://aurorascan.dev/"],
    iconUrls: [auroraNetworkIcon],
  },
  1666600000: {
    urls: ["https://api.harmony.one"],
    name: "Harmony Mainnet",
    nativeCurrency: ONE,
    blockExplorerUrls: ["https://explorer.harmony.one/"],
    iconUrls: [harmonyNetworkIcon],
  },
};

export const URLS: { [chainId: number]: string[] } = Object.keys(
  CHAINS
).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls;

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs;
  }

  return accumulator;
}, {});
