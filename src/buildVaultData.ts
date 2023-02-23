import { ChainId, COLLATERALS } from '@qidao/sdk'
import { fetchVaultInfo } from './vaultInfo.js'

const chainId = ChainId.MATIC
const contractMetas = COLLATERALS[chainId]

export const vaultInfoPromises = contractMetas?.map((contractMeta) => {
    return fetchVaultInfo(contractMeta)
})

export const buildVaultData = (vaultInfoPromises: []) => {
    if (vaultInfoPromises)
        Promise.all(vaultInfoPromises).then((res) => {
            return res
        })
}
