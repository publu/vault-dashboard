import { ChainId } from './constants.js'
import { ContractMeta, Contracts } from './ContractMetas.js'
import { fetchVaultInfo } from './vaultInfo.js'

const chainId = ChainId.MATIC
const contractMetas: ContractMeta[] | undefined = Contracts[chainId]

export const vaultInfoPromises = contractMetas?.map((contractMeta) => {
    return fetchVaultInfo(chainId, contractMeta.address, contractMeta.abi, contractMeta.decimals, contractMeta.factory, contractMeta.slug)
})

export const buildVaultData = (vaultInfoPromises: []) => {
    if (vaultInfoPromises)
        Promise.all(vaultInfoPromises).then((res) => {
            return res
        })
}

