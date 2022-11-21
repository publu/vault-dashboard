import {
  ChainId,
  COLLATERAL,
  COLLATERAL_V2,
  GAUGE_VALID_COLLATERAL,
  GAUGE_VALID_COLLATERAL_V2,
} from "@qidao/sdk";
import { useQuery } from "@tanstack/react-query";
import { subMinutes, subMonths } from "date-fns/fp";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useChainId } from "../Connectors/Metamask";
import { getBlockNumbersFromTS } from "./blockNumer";

const TOPIC0 =
  "0x4d151d3a98b83151d51917640c221f8c8e3c054422ea1b48dcbbd57e3f4210d5";
const API_KEY = "YourApiKeyToken";

const chainApiUrl: { [chainId in ChainId]: string } = {
  [ChainId.ARBITRUM]: "api.arbiscan.io/api",
  [ChainId.MAINNET]: "api.etherscan.io/api",
  [ChainId.ROPSTEN]: "",
  [ChainId.RINKEBY]: "",
  [ChainId.GÖRLI]: "",
  [ChainId.KOVAN]: "",
  [ChainId.FANTOM]: "api.ftmscan.com/api",
  [ChainId.FANTOM_TESTNET]: "",
  [ChainId.MATIC]: "api.polygonscan.com/api",
  [ChainId.MATIC_TESTNET]: "",
  [ChainId.XDAI]: "",
  [ChainId.BSC]: "api.bscscan.com/api",
  [ChainId.BSC_TESTNET]: "",
  [ChainId.MOONBASE]: "",
  [ChainId.AVALANCHE]: "api.snowtrace.io/api",
  [ChainId.FUJI]: "",
  [ChainId.HECO]: "",
  [ChainId.HECO_TESTNET]: "",
  [ChainId.HARMONY]: "",
  [ChainId.HARMONY_TESTNET]: "",
  [ChainId.MOONRIVER]: "api-moonriver.moonscan.io/api",
  [ChainId.CRONOS]: "api.cronoscan.com/api",
  [ChainId.OPTIMISM]: "api-optimistic.etherscan.io/api",
  [ChainId.SYSCOIN]: "explorer.syscoin.org/api",
  [ChainId.METIS]: "andromeda-explorer.metis.io/api",
  [ChainId.MOONBEAM]: "api-moonbeam.moonscan.io",
  [ChainId.MILKOMEDA]: "", //API points to localhost
  [ChainId.KAVA]: "",
  [ChainId.IOTEX]: "",
  [ChainId.KLAYTN]: "",
  [ChainId.CELO]: "explorer.celo.org/api",
  [ChainId.AURORA]: "api.aurorascan.dev/api",
  [ChainId.BOBA]: "", //No logs api https://bobascan.com/apis
  [ChainId.CUBE]: "",
};
export interface LiquidationHistoryResult {
  status: string;
  message: string;
  result: Result[];
}

export interface Result {
  address: string;
  topics: string[];
  data: string;
  blockNumber: string;
  blockHash: string;
  timeStamp: string;
  gasPrice: string;
  gasUsed: string;
  logIndex: string;
  transactionHash: string;
  transactionIndex: string;
}

export async function fetchLiquidationHistory(
  chainId: ChainId,
  fromBlock: number,
  toBlock: number,
  address: string
): Promise<LiquidationHistoryResult | undefined> {
  const url = chainApiUrl[chainId];
  if (url !== "") {
    const res = await fetch(
      `https://${url}?module=logs&action=getLogs` +
        `&fromBlock=${fromBlock}&toBlock=${toBlock}&address=${address}` +
        `&topic0=${TOPIC0}&apikey=${API_KEY}`
    );
    return await res.json();
  } else {
    return;
  }
}

export interface LiquidationLog
  extends Omit<ethers.utils.LogDescription, "args"> {
  args: {
    owner: string;
    debtRepaid: BigNumber;
    vaultID: number;
    collateralLiquidated: BigNumber;
    closingFee: BigNumber;
    buyer: string;
  };
  transactionHash: string;
  id: string | number;
  timestamp: string;
}

export const useLiquidationHistory = (
  collateral:
    | COLLATERAL
    | GAUGE_VALID_COLLATERAL
    | COLLATERAL_V2
    | GAUGE_VALID_COLLATERAL_V2
    | undefined
) => {
  const chainId = useChainId();
  const [liquidations, setLiquidations] = useState<LiquidationLog[]>([]);

  const { data: liq } = useQuery(
    [chainId, collateral?.vaultAddress || "", "liquidation-history"],
    async () => {
      if (chainId && collateral) {
        const vaultAddress = collateral.vaultAddress;
        const endDate = subMinutes(1, new Date());
        const { data: endBlockData } = await getBlockNumbersFromTS(
          endDate,
          chainId
        );
        const endBlock = endBlockData.blocks[0].number;

        const startDate = subMonths(2, endDate);
        const { data: startBlockData } = await getBlockNumbersFromTS(
          startDate,
          chainId
        );
        const startBlock = startBlockData.blocks[0].number;

        return await fetchLiquidationHistory(
          chainId,
          startBlock,
          endBlock,
          vaultAddress
        );
      } else return null;
    }
  );
  useEffect(() => {
    if (chainId) {
      const eventAbi = [
        "event LiquidateVault (uint256 vaultID, address owner, address buyer, uint256 debtRepaid, uint256 collateralLiquidated, uint256 closingFee)",
      ];
      let iface = new ethers.utils.Interface(eventAbi);
      if (liq && liq.result && liq.result.map) {
        const liquidationCalls: LiquidationLog[] = liq.result.map((foo) => {
          const res = iface.parseLog({ topics: foo.topics, data: foo.data });
          return {
            ...res,
            transactionHash: foo.transactionHash,
            timestamp: foo.timeStamp,
            id: foo.transactionHash,
            args: {
              buyer: res.args.buyer,
              closingFee: res.args.closingFee,
              collateralLiquidated: res.args.collateralLiquidated,
              debtRepaid: res.args.debtRepaid,
              owner: res.args.owner,
              vaultID: res.args.vaultID.toNumber(),
            },
          };
        });

        setLiquidations(liquidationCalls || []);
      }
    }
  }, [liq, chainId, collateral]);

  return liquidations;
};
