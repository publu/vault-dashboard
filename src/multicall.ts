import { ChainId } from "@qidao/sdk";
import { Provider, setMulticallAddress } from "ethers-multicall";
import { MULTICALL_NETWORKS, PROVIDERS, RPCS } from "./constants";

const ethcallProvider: { [chainId in ChainId]?: Provider } = {};

async function setupAndInitMulticall(chainId: ChainId) {
  setMulticallAddress(chainId, MULTICALL_NETWORKS[chainId] || "");
  console.log(`Setting up multicall for Chain ${chainId}`)
  let provider = PROVIDERS[chainId];
  if (provider) {
    const callProvider = new Provider(provider);
    await callProvider.init();
    ethcallProvider[chainId] = callProvider;
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
  console.log({callProvider, chainId})
  if (callProvider) {
    return await callProvider.all(calls);
  } else {
    throw new Error(
      `No call provider for chain: ${chainId}, did you call init?`
    );
  }
}
