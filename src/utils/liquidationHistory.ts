import {
  ChainId,
  COLLATERAL,
  COLLATERAL_V2,
  GAUGE_VALID_COLLATERAL,
  GAUGE_VALID_COLLATERAL_V2,
} from "@qidao/sdk";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { fromUnixTime, subMinutes, subMonths } from "date-fns/fp";
import { BigNumber, ethers } from "ethers";
import PQueue from "p-queue";
import { bigNumberToFloat } from "./bigNumber";
import { getBlockNumbersFromTS } from "./blockNumer";

const TOPIC0 =
  "0x4d151d3a98b83151d51917640c221f8c8e3c054422ea1b48dcbbd57e3f4210d5";
const API_KEY = "YourApiKeyToken";

const chainScannerApiUrlBase = {
  [ChainId.ARBITRUM]: "api.arbiscan.io/api",
  [ChainId.MAINNET]: "api.etherscan.io/api",
  [ChainId.FANTOM]: "api.ftmscan.com/api",
  [ChainId.MATIC]: "api.polygonscan.com/api",
  [ChainId.BSC]: "api.bscscan.com/api",
  [ChainId.AVALANCHE]: "api.snowtrace.io/api",
  [ChainId.MOONRIVER]: "api-moonriver.moonscan.io/api",
  [ChainId.CRONOS]: "api.cronoscan.com/api",
  [ChainId.OPTIMISM]: "api-optimistic.etherscan.io/api",
  [ChainId.SYSCOIN]: "explorer.syscoin.org/api",
  [ChainId.METIS]: "andromeda-explorer.metis.io/api",
  [ChainId.MOONBEAM]: "api-moonbeam.moonscan.io",
  // [ChainId.MILKOMEDA]: "", //API points to localhost
  [ChainId.CELO]: "explorer.celo.org/api",
  [ChainId.AURORA]: "api.aurorascan.dev/api",
  // [ChainId.BOBA]: "", //No logs api https://bobascan.com/apis
} as const;

type ChainIdWithScanner = keyof typeof chainScannerApiUrlBase;
type ScannerUrl = typeof chainScannerApiUrlBase[ChainIdWithScanner];

const chainHasScannerUrl = (
  chainId: ChainId | ChainIdWithScanner
): chainId is ChainIdWithScanner => {
  return Object.keys(chainScannerApiUrlBase)
    .map((x) => parseInt(x))
    .includes(chainId);
};

const scannerLimitQueues: { [k in ScannerUrl]: PQueue } = Object.fromEntries(
  Object.values(chainScannerApiUrlBase).map<[ScannerUrl, PQueue]>(
    (scannerBaseUrl) => {
      return [
        scannerBaseUrl,
        new PQueue({ concurrency: 2, interval: 1000, intervalCap: 2 }),
      ];
    }
  )
);

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
  if (chainHasScannerUrl(chainId)) {
    const url = chainScannerApiUrlBase[chainId];
    const q = scannerLimitQueues[url];
    const res = await q.add(
      async () =>
        await fetch(
          `https://${url}?module=logs&action=getLogs` +
            `&fromBlock=${fromBlock}&toBlock=${toBlock}&address=${address}` +
            `&topic0=${TOPIC0}&apikey=${API_KEY}`
        )
    );
    return await res.json();
  }
  return;
}

export interface LiquidationLog
  extends Omit<ethers.utils.LogDescription, "args"> {
  args: {
    owner: string;
    debtRepaid: number;
    vaultID: number;
    collateralLiquidated: number;
    closingFee: number;
    buyer: string;
  };
  transactionHash: string;
  id: string | number;
  tokenName: string;
  chainId: ChainId;
  timestamp: Date;
}

export const useLiquidationHistory = (
  collaterals:
    | (
        | COLLATERAL
        | GAUGE_VALID_COLLATERAL
        | COLLATERAL_V2
        | GAUGE_VALID_COLLATERAL_V2
      )[]
    | undefined
): UseQueryResult<LiquidationLog[] | null | undefined>[] => {
  return useQueries({
    queries: (collaterals || []).map((collateral) => {
      const chainId = collateral.chainId;
      return {
        queryKey: [
          chainId,
          collateral?.vaultAddress || "",
          "liquidation-history",
        ],
        queryFn: async () => {
          if (collateral) {
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

            const liq = await fetchLiquidationHistory(
              chainId,
              startBlock,
              endBlock,
              vaultAddress
            );

            const eventAbi = [
              "event LiquidateVault (uint256 vaultID, address owner, address buyer, uint256 debtRepaid, uint256 collateralLiquidated, uint256 closingFee)",
            ];
            let iface = new ethers.utils.Interface(eventAbi);
            if (liq && liq.result && liq.result.map) {
              const liquidationCalls: LiquidationLog[] = liq.result.map(
                (foo) => {
                  const res = iface.parseLog({
                    topics: foo.topics,
                    data: foo.data,
                  });
                  return {
                    ...res,
                    transactionHash: foo.transactionHash,
                    timestamp: fromUnixTime(
                      BigNumber.from(foo.timeStamp).toNumber()
                    ),
                    id: foo.transactionHash,
                    tokenName: collateral.token.name || "",
                    chainId: collateral.chainId,
                    args: {
                      buyer: res.args.buyer,
                      closingFee: bigNumberToFloat(
                        res.args.closingFee,
                        collateral.token.decimals
                      ),
                      collateralLiquidated: bigNumberToFloat(
                        res.args.collateralLiquidated,
                        collateral.token.decimals
                      ),
                      debtRepaid: bigNumberToFloat(res.args.debtRepaid),
                      owner: res.args.owner,
                      vaultID: res.args.vaultID.toNumber(),
                    },
                  };
                }
              );
              return liquidationCalls;
            }
          }
          return null;
        },
      };
    }),
  });
};
