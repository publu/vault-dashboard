import { JsonRpcProvider } from '@ethersproject/providers'
import { ChainId, COLLATERAL, COLLATERAL_V2, DISCRIMINATOR_TO_ABI, GAUGE_VALID_COLLATERAL, GAUGE_VALID_COLLATERAL_V2 } from '@qidao/sdk'
import { Contract } from 'ethcall'
import _ from 'lodash'
import { ChainName, RPCS } from './constants'
import { ERC20__factory } from './contracts'
import { multicall } from './multicall'
import { getId } from './utils/utils'

export interface VaultInfo extends COLLATERAL {
    id: string | number
    owner: string
    tokenName: string
    cdr: number
    depositedCollateralAmount: number
    debt: number
    vaultIdx: number
    contract: Contract
    chainId: ChainId
    vaultChainName: string
    vaultLink: string
    risky: number
}

export interface GaugeValidVaultInfo extends VaultInfo {}

export interface VaultInfoV2 extends Omit<VaultInfo, 'version' | 'connect' | 'discriminator'>, COLLATERAL_V2 {}

export interface GaugeValidVaultInfoV2 extends VaultInfoV2 {}

export async function fetchVaultInfo(collateral: COLLATERAL | COLLATERAL_V2 | GAUGE_VALID_COLLATERAL | GAUGE_VALID_COLLATERAL_V2) {
    const ethersProvider = new JsonRpcProvider(RPCS[collateral.chainId])
    const abi = DISCRIMINATOR_TO_ABI[collateral.discriminator]
    const vaultContract = new Contract(collateral.vaultAddress, abi as any)
    const totalSupplyCall = vaultContract.vaultCount() // because totalSupply isn't all-encompassing.
    const collateralPriceCall = vaultContract.getEthPriceSource()
    const collateralAddressCall = vaultContract.collateral()

    let [totalSupply, collateralPrice, collateralAddress]: any[] = await multicall(collateral.chainId, [
        totalSupplyCall,
        collateralPriceCall,
        collateralAddressCall,
    ])

    totalSupply = totalSupply.toNumber()
    collateralPrice = (collateralPrice as unknown as number) / 1e8

    const collateralERC20 = ERC20__factory.connect(collateralAddress, ethersProvider)
    const tokenName = await collateralERC20.symbol()
    // const tokenDecimals = await collateralERC20.decimals()
    const limitToFetch = totalSupply
    const existsCalls = _.range(limitToFetch).map((i) => vaultContract.exists(i))

    const vaultsExistCheck: any[] = await multicall(collateral.chainId, existsCalls)

    const vaultsToFetch = limitToFetch ? _.range(limitToFetch).filter((i) => vaultsExistCheck[i]) : []

    const collateralCalls = vaultsToFetch.map((i) => vaultContract.vaultCollateral(i))
    const collateralAmounts = await multicall(collateral.chainId, collateralCalls)
    const debtCalls = vaultsToFetch.map((i) => vaultContract.vaultDebt(i))
    const debtAmounts = await multicall(collateral.chainId, debtCalls)
    const ownerCalls = vaultsToFetch.map((i) => vaultContract.ownerOf(i))
    const owners = await multicall<string>(collateral.chainId, ownerCalls)

    const riskyCalls = vaultsToFetch.map((i) => vaultContract.checkLiquidation(i))
    const riskyVaults = await multicall<any>(collateral.chainId, riskyCalls)

    const vaultChainName = ChainName[collateral.chainId]
    const vaultInfo: (VaultInfo | VaultInfoV2 | GaugeValidVaultInfo | GaugeValidVaultInfoV2)[] = []

    for (let i = 0; i < vaultsToFetch.length; i++) {
        const vaultIdx = vaultsToFetch[i]
        const vaultLink =
            'https://app.mai.finance/vaults/' + collateral.chainId.toString() + '/' + collateral.shortName + '/' + vaultIdx.toString()
        const owner = owners[i] || ''
        const risky = riskyVaults[i] || false

        const collateralAmount = (collateralAmounts[i] as unknown as number) / 10 ** collateral.token.decimals
        const debt = (debtAmounts[i] as unknown as number) / 1e18
        const contract = vaultContract
        let cdr = (collateralAmount * collateralPrice) / debt
        cdr = isNaN(cdr) ? 0 : cdr
        vaultInfo.push({
            ...collateral,
            id: getId(collateral, vaultIdx),
            vaultIdx,
            tokenName,
            owner,
            cdr,
            depositedCollateralAmount: collateralAmount,
            debt,
            contract,
            chainId: collateral.chainId,
            vaultChainName,
            vaultLink,
            risky,
        })
    }
    return vaultInfo
}
