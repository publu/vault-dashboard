import { ChainId } from "@qidao/sdk";
import { Provider, setMulticallAddress } from "ethers-multicall";
import _ from "lodash";
import PQueue from "p-queue";
import { MULTICALL_NETWORKS, PROVIDERS, RPCS } from "./constants";

const ethcallProvider: { [chainId in ChainId]?: Provider } = {};
const ethcallQueue: { [chainId in ChainId]?: PQueue } = {};
const MULTICALL_CONCURRENCY = 5;

async function setupAndInitMulticall(chainId: ChainId) {
  setMulticallAddress(chainId, MULTICALL_NETWORKS[chainId] || "");
  console.log(`Setting up multicall for Chain ${chainId}`);
  let provider = PROVIDERS[chainId];
  if (provider) {
    const callProvider = new Provider(provider);
    await callProvider.init();
    ethcallProvider[chainId] = callProvider;
    ethcallQueue[chainId] = new PQueue({ concurrency: MULTICALL_CONCURRENCY });
  }
}

export async function init() {
  return Promise.all(
    Object.keys(RPCS)
      .map((i) => parseInt(i))
      .map(async (cId) => {
        return await setupAndInitMulticall(cId as ChainId);
      })
  );
}

export async function multicall(chainId: ChainId, calls: any[]) {
  const callProvider = ethcallProvider[chainId];
  const queue = ethcallQueue[chainId];
  if (callProvider) {
    return (
      await Promise.all(
        _.chunk(calls, 450).map((cs) => {
          return queue?.add(() => callProvider.all(cs));
        })
      )
    ).flat();
  } else {
    throw new Error(
      `No call provider for chain: ${chainId}, did you call init?`
    );
  }
}
