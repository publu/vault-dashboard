import { ChainId } from '@qidao/sdk'
import { Provider } from 'ethcall'
import _ from 'lodash'
import PQueue from 'p-queue'
import { PROVIDERS, RPCS } from './constants'

const ethcallProvider: { [chainId in ChainId]?: Provider } = {}
const ethcallQueue: { [chainId in ChainId]?: PQueue } = {}
const ethcall2Queue: { [chainId in ChainId]?: PQueue } = {}
const MULTICALL_CONCURRENCY = 5

async function setupAndInitMulticall(chainId: ChainId) {
    // setMulticallAddress(chainId, MULTICALL_NETWORKS[chainId] || "");
    let provider = PROVIDERS[chainId]
    if (provider && !ethcallProvider[chainId]) {
        const callProvider = new Provider()
        await callProvider.init(provider)
        ethcallProvider[chainId] = callProvider
        ethcallQueue[chainId] = new PQueue({ concurrency: MULTICALL_CONCURRENCY })
        ethcall2Queue[chainId] = new PQueue({ concurrency: MULTICALL_CONCURRENCY })
    }
}

export async function init() {
    const EXCLUDE_LIST = [5]

    return Promise.all(
        Object.keys(RPCS)
            .map((i) => parseInt(i))
            .filter((i) => {
                return !EXCLUDE_LIST.includes(i)
            })
            .map(async (cId) => {
                return await setupAndInitMulticall(cId as ChainId)
            })
    )
}

export async function multicall<T>(chainId: ChainId, calls: any[]) {
    const callProvider = ethcallProvider[chainId]
    const queue = ethcallQueue[chainId]
    if (callProvider) {
        return (
            await Promise.all(
                _.chunk(calls, 450).map((cs) => {
                    return queue?.add(() => callProvider.all<T>(cs))
                })
            )
        ).flat()
    } else {
        throw new Error(`No call provider for chain: ${chainId}, did you call init?`)
    }
}

export async function multicall2<T>(chainId: ChainId, calls: any[]) {
    const callProvider = ethcallProvider[chainId]
    const queue = ethcall2Queue[chainId]
    if (callProvider) {
        return (
            await Promise.all(
                _.chunk(calls, 450).map((cs) => {
                    return queue?.add(() => callProvider.tryAll<T>(cs))
                })
            )
        ).flat()
    } else {
        throw new Error(`No call provider for chain: ${chainId}, did you call init?`)
    }
}
export async function multicall3<T>(chainId: ChainId, calls: any[]) {
    const callProvider = ethcallProvider[chainId]
    const queue = ethcall2Queue[chainId]
    if (callProvider) {
        return (
            await Promise.all(
                _.chunk(calls, 450).map((cs) => {
                    return queue?.add(() =>
                        callProvider.tryEach<T>(
                            cs,
                            cs.map(() => true)
                        )
                    )
                })
            )
        ).flat()
    } else {
        throw new Error(`No call provider for chain: ${chainId}, did you call init?`)
    }
}
