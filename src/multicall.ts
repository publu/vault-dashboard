import { Provider, setMulticallAddress } from 'ethers-multicall'
import { ChainId, ChainIdKey, MULTICALL_NETWORKS, PROVIDERS, RPCS } from './constants'

const ethcallProvider: { [chainId in typeof ChainId[keyof typeof ChainId]]?: Provider } = {}

async function setupAndInitMulticall(chainId: ChainIdKey) {
    setMulticallAddress(chainId, MULTICALL_NETWORKS[chainId])
    let provider = PROVIDERS[chainId]
    if (provider) {
        const callProvider = new Provider(provider)
        await callProvider.init()
        ethcallProvider[chainId] = callProvider
    }
}

export async function init() {
    return Promise.all(
        Object.keys(RPCS)
            .map((i) => parseInt(i))
            .map(async (cId) => {
                return await setupAndInitMulticall(cId as ChainIdKey)
            }),
    )
}

export async function multicall(chainId: ChainIdKey, calls: any[]) {
    const callProvider = ethcallProvider[chainId]
    if (callProvider) {
        return await callProvider.all(calls)
    } else {
        throw `No call provider for chain: ${chainId}, did you call init?`
    }
}
