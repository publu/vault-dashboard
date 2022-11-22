import { JsonRpcProvider } from "@ethersproject/providers";
import { ChainId } from "@qidao/sdk";
import {
  CrosschainMai__factory,
  EditableERC20__factory,
  QiStablecoin__factory,
} from "./contracts/factories";

export const ChainName: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: "Ethereum",
  [ChainId.RINKEBY]: "Rinkeby",
  [ChainId.ROPSTEN]: "Ropsten",
  [ChainId.GÖRLI]: "Görli",
  [ChainId.KOVAN]: "Kovan",
  [ChainId.FANTOM]: "Fantom",
  [ChainId.FANTOM_TESTNET]: "Fantom Testnet",
  [ChainId.MATIC]: "Polygon",
  [ChainId.MATIC_TESTNET]: "Matic Testnet",
  [ChainId.XDAI]: "Gnosis Chain",
  [ChainId.BSC]: "BNB",
  [ChainId.BSC_TESTNET]: "BSC Testnet",
  [ChainId.MOONBASE]: "Moonbase",
  [ChainId.AVALANCHE]: "Avalanche",
  [ChainId.FUJI]: "Fuji",
  [ChainId.HECO]: "HECO",
  [ChainId.HECO_TESTNET]: "HECO Testnet",
  [ChainId.HARMONY]: "Harmony",
  [ChainId.HARMONY_TESTNET]: "Harmony Testnet",
  [ChainId.MOONRIVER]: "Moonriver",
  [ChainId.CRONOS]: "Cronos",
  [ChainId.ARBITRUM]: "Arbitrum",
  [ChainId.OPTIMISM]: "Optimism",
  [ChainId.SYSCOIN]: "Syscoin",
  [ChainId.METIS]: "Metis",
  [ChainId.MOONBEAM]: "Moonbeam",
  [ChainId.MILKOMEDA]: "Milkomeda",
  [ChainId.KAVA]: "Kava",
  [ChainId.IOTEX]: "IoTeX",
  [ChainId.KLAYTN]: "Klaytn",
  [ChainId.CELO]: "Celo",
  [ChainId.AURORA]: "Aurora",
  [ChainId.BOBA]: "Boba",
  [ChainId.CUBE]: "Cube",
};

export const maiAddresses: { [index: string]: any } = {
  MATIC: "0xa3fa99a148fa48d14ed51d610c367c61876997f1",
  SOLANA: "9mWRABuz2x6koTPCWiCPM49WUbcrNqGTHBV9T9k7y1o7",
  FANTOM: "0xfb98b335551a418cd0737375a2ea0ded62ea213b",
  AVALANCHE: "0x5c49b268c9841aff1cc3b0a418ff5c3442ee3f3b",
  MOONRIVER: "0xFb2019DfD635a03cfFF624D210AEe6AF2B00fC2C",
  HARMONY: "0x3F56e0c36d275367b8C502090EDF38289b3dEa0d",
  CRONOS: "0x2Ae35c8E3D4bD57e8898FF7cd2bBff87166EF8cb",
  ARBITRUM: "0x3F56e0c36d275367b8C502090EDF38289b3dEa0d",
  BOBA: "0x3F56e0c36d275367b8C502090EDF38289b3dEa0d",
  GNOSIS: "0x3F56e0c36d275367b8C502090EDF38289b3dEa0d",
  METIS: "0xdFA46478F9e5EA86d57387849598dbFB2e964b02",
  BSC: "0x3F56e0c36d275367b8C502090EDF38289b3dEa0d",
  AURORA: "0xdFA46478F9e5EA86d57387849598dbFB2e964b02",
  CELO: "0xB9C8F0d3254007eE4b98970b94544e473Cd610EC",
  IOTEX: "0x3F56e0c36d275367b8C502090EDF38289b3dEa0d",
  OPTIMISM: "0xdFA46478F9e5EA86d57387849598dbFB2e964b02",
  MOONBEAM: "0xdfa46478f9e5ea86d57387849598dbfb2e964b02",
};

export const MULTICALL_NETWORKS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
  [ChainId.ROPSTEN]: "0x53C43764255c17BD724F74c4eF150724AC50a3ed",
  [ChainId.KOVAN]: "0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A",
  [ChainId.RINKEBY]: "0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821",
  [ChainId.GÖRLI]: "0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e",
  [ChainId.FANTOM]: "0x63B8310c5093ac917552931D8b15d5AB6945c0a6",
  [ChainId.FANTOM_TESTNET]: "",
  [ChainId.MATIC]: "0x95028E5B8a734bb7E2071F96De89BABe75be9C8E",
  [ChainId.MATIC_TESTNET]: "0x9Fc8e50Eb08C1F463b45d1AFb9c261B0a1903006",
  [ChainId.XDAI]: "0xb5b692a88BDFc81ca69dcB1d924f59f0413A602a",
  [ChainId.BSC]: "0xe348b292e8eA5FAB54340656f3D374b259D658b8",
  [ChainId.BSC_TESTNET]: "0xe348b292e8eA5FAB54340656f3D374b259D658b8",
  [ChainId.ARBITRUM]: "0x80C7DD17B01855a6D2347444a0FCC36136a314de",
  [ChainId.MOONBASE]: "0x9B7D5fa91b4747031d8E7807DaEC906F0f683E78",
  [ChainId.AVALANCHE]: "0x0FB54156B496b5a040b51A71817aED9e2927912E",
  [ChainId.FUJI]: "0x0053957E18A0994D3526Cf879A4cA7Be88e8936A",
  [ChainId.HECO]: "0xc9a9F768ebD123A00B52e7A0E590df2e9E998707",
  [ChainId.HECO_TESTNET]: "0x935Bfe9AfaA2Be26049ea4EDE40A3A2243361F87",
  [ChainId.HARMONY]: "0xFE4980f62D708c2A84D3929859Ea226340759320",
  [ChainId.HARMONY_TESTNET]: "0xbcd3451992B923531615293Cb2b2c38ba8DE9529",
  [ChainId.MOONBEAM]: "0x83e3b61886770de2F64AAcaD2724ED4f08F7f36B",
  [ChainId.MOONRIVER]: "0xe05349d6fE12602F6084550995B247a5C80C0E2C",
  [ChainId.CRONOS]: "0xA25da25BD11A26F1dd4ea195948305fb7C8cA102",
  [ChainId.OPTIMISM]: "0x142e2feac30d7fc3b61f9ee85fccad8e560154cc",
  [ChainId.METIS]: "0xc39aBB6c4451089dE48Cffb013c39d3110530e5C",
};

export const RPCS: { [chainId in ChainId]: string } = {
  [ChainId.ARBITRUM]: "https://arb1.arbitrum.io/rpc",
  [ChainId.MAINNET]: "https://rpc.ankr.com/eth",
  [ChainId.ROPSTEN]:
    "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  [ChainId.RINKEBY]:
    "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  [ChainId.GÖRLI]:
    "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161\n",
  [ChainId.KOVAN]:
    "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  [ChainId.FANTOM]: "https://rpc.ftm.tools/",
  [ChainId.FANTOM_TESTNET]: "https://rpc.testnet.fantom.network",
  [ChainId.MATIC]: "https://polygon-rpc.com",
  [ChainId.MATIC_TESTNET]: "https://rpc-mumbai.maticvigil.com",
  [ChainId.XDAI]: "https://rpc.ankr.com/gnosis",
  [ChainId.BSC]: "https://bsc-dataseed.binance.org/",
  [ChainId.BSC_TESTNET]: "https://data-seed-prebsc-2-s3.binance.org:8545",
  [ChainId.MOONBASE]: "https://rpc.testnet.moonbeam.network",
  [ChainId.AVALANCHE]: "https://api.avax.network/ext/bc/C/rpc",
  [ChainId.FUJI]: "https://api.avax-test.network/ext/bc/C/rpc",
  [ChainId.HECO]: "https://http-mainnet.hecochain.com",
  [ChainId.HECO_TESTNET]: "https://http-testnet.hecochain.com",
  [ChainId.HARMONY]: "https://rpc.ankr.com/harmony",
  [ChainId.HARMONY_TESTNET]: "https://explorer.pops.one",
  [ChainId.MOONRIVER]: "https://rpc.moonriver.moonbeam.network",
  [ChainId.CRONOS]: "https://evm-cronos.crypto.org",
  [ChainId.OPTIMISM]: "https://rpc.ankr.com/optimism",
  [ChainId.SYSCOIN]: "https://rpc.ankr.com/syscoin",
  [ChainId.METIS]: "https://andromeda.metis.io/?owner=1088",
  [ChainId.MOONBEAM]: "https://rpc.ankr.com/moonbeam",
  [ChainId.MILKOMEDA]: "https://rpc-mainnet-cardano-evm.c1.milkomeda.com",
  [ChainId.KAVA]: "https://evm.kava.io",
  [ChainId.IOTEX]: "https://rpc.ankr.com/iotex",
/*  [ChainId.KLAYTN]: "https://klaytn01.fandom.finance",*/
  [ChainId.CELO]: "https://forno.celo.org",
  [ChainId.AURORA]: "https://mainnet.aurora.dev",
  [ChainId.BOBA]: "https://mainnet.boba.network",
  [ChainId.CUBE]: "https://http-mainnet.cube.network",
};

const SKIP_RPCS = [
  ChainId.ROPSTEN,
  ChainId.GÖRLI,
  ChainId.RINKEBY,
  ChainId.KOVAN,
  ChainId.HARMONY_TESTNET,
  ChainId.HECO,
  ChainId.HECO_TESTNET,
  ChainId.FANTOM_TESTNET,
];

export const PROVIDERS = Object.entries(RPCS).reduce(
  (previousValue, currentValue) => {
    const [curCId, curRpc] = currentValue;
    const chainId = parseInt(curCId) as ChainId;
    if (!SKIP_RPCS.includes(chainId)) {
      previousValue[chainId] = new JsonRpcProvider(curRpc);
    }
    return previousValue;
  },
  {} as { [chainId in ChainId]?: JsonRpcProvider }
);

export const MAIFACTORIES: { [chainId in ChainId]?: any } = {
  [ChainId.AVALANCHE]: CrosschainMai__factory,
  [ChainId.MOONBEAM]: EditableERC20__factory,
  [ChainId.ARBITRUM]: QiStablecoin__factory,
  [ChainId.FANTOM]: QiStablecoin__factory,
  [ChainId.MATIC]: QiStablecoin__factory,
  [ChainId.MOONRIVER]: EditableERC20__factory,
  [ChainId.XDAI]: QiStablecoin__factory,
  [ChainId.HARMONY]: QiStablecoin__factory,
  [ChainId.OPTIMISM]: QiStablecoin__factory,
  [ChainId.BSC]: QiStablecoin__factory,
  [ChainId.METIS]: EditableERC20__factory,
};
