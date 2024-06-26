import DeleteIcon from '@mui/icons-material/Delete'
import * as MUI from '@mui/material'
import { Button } from '@mui/material'
import {
    AVAX_ZAPPER_ADDRESS,
    CAM_META,
    CAMZAPPER_ADDRESS,
    ChainId,
    COLLATERAL,
    COLLATERAL_V2,
    COLLATERALS,
    DISCRIMINATOR_TO_ABI,
    Erc20Stablecoin,
    FTM_ZAPPER_ADDRESS,
    GAUGE_VALID_COLLATERAL,
    GAUGE_VALID_COLLATERAL_V2,
    OG_MATIC_VAULT,
    ZAP_META,
} from '@qidao/sdk'
import { Contract } from 'ethcall'
import { ethers } from 'ethers'
import _, { isEmpty } from 'lodash'
import React, { Dispatch, useEffect, useState } from 'react'
import {
    Datagrid,
    ListContextProvider,
    NumberField,
    TextField,
    TextFieldProps,
    useList,
    useListContext,
    useRecordContext,
    useUnselect,
} from 'react-admin'
import { TxForTxBuilder } from '../components/types'
import { useProvider } from '../Connectors/Metamask'
import { ChainName } from '../constants'
import { BeefyZapper__factory, CamZapper__factory, Erc20QiStablecoin__factory } from '../contracts'
import { init, multicall, multicall3 } from '../multicall'
import { shortenHex } from '../utils/addresses'
import { saveTemplateAsJsonFile } from '../utils/files'
import { getId } from '../utils/utils'

// const safeAddress = "0x3182E6856c3B59C39114416075770Ec9DC9Ff436"; //ETH Address
// const transactionServiceUrl = "https://safe-transaction.gnosis.io/"; // on rinkeby testnet
// const chainId = 1;
// const safeAddress = "0xBdeEf118d161ac657AF5Abc2a26487DD894868c7"; //ETH Address
// const transactionServiceUrl = "https://safe-transaction.polygon.gnosis.io/"; // on rinkeby testnet
// const chainId = 137;

// const setupSafe = async (metamaskProvider: Web3Provider) => {
//   const ethAdapter = new EthersAdapter({
//     ethers,
//     signer: metamaskProvider.getSigner(),
//   });
//
//   console.log({ chainId: await ethAdapter.getChainId() });
//   const safeService = new SafeServiceClient({
//     ethAdapter,
//     txServiceUrl: transactionServiceUrl,
//   });
//   const safeSdk = await Safe.create({
//     ethAdapter,
//     safeAddress,
//     contractNetworks: {
//       "137": {
//         multiSendAddress: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
//         multiSendCallOnlyAddress: "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D",
//         safeMasterCopyAddress: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
//         safeProxyFactoryAddress: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
//       },
//     },
//   });
//   return { safeService, safeSdk };
// };

const EditiableRow = (
    props: TextFieldProps & {
        vaults: TreasuryManagementVaultData[]
        setVaults: Dispatch<React.SetStateAction<TreasuryManagementVaultData[]>>
        source: string
    }
) => {
    const [editMode, setEditMode] = useState(false)
    const foo: TreasuryManagementVaultData = useRecordContext(props)
    const [collateralValue, setCollateralValue] = useState(foo.depositedCollateralAmount)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newInt = parseFloat(event.target.value)
        const updatedVault = {
            ...foo,
            depositedCollateralAmount: newInt ? newInt : 0,
        }
        const updatedVaults = props.vaults.map((v) => (v.id !== updatedVault.id ? v : updatedVault))
        console.log({ updatedVaults })
        props.setVaults(updatedVaults)
        setCollateralValue(newInt ? newInt : 0)
    }
    return (
        <>
            {editMode ? (
                <MUI.TextField value={collateralValue} size="small" onChange={handleChange} onBlur={() => setEditMode(!editMode)} />
            ) : (
                <TextField onClick={() => setEditMode(!editMode)} source={props.source} />
            )}
        </>
    )
}

const AddressField = (
    props: TextFieldProps & {
        source: string
    }
) => {
    const record = useRecordContext(props)
    console.log(record)
    return <span>{shortenHex(record.owner)}</span>
}

const ChainSelector: React.FC<{
    selectedChainId: ChainId
    setSelectedChainId: Function
}> = ({ selectedChainId, setSelectedChainId }) => {
    return (
        <MUI.FormControl>
            <MUI.InputLabel id="demo-simple-select-label">Chain</MUI.InputLabel>
            <MUI.Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedChainId}
                label="ChainId"
                onChange={(e) => {
                    let cId: ChainId
                    if (typeof e.target.value === 'string') cId = parseInt(e.target.value) as ChainId
                    else cId = e.target.value as ChainId
                    setSelectedChainId(cId)
                }}
            >
                {Object.keys(COLLATERALS)
                    .map((cId) => {
                        return parseInt(cId) as ChainId
                    })
                    .filter((chainId) => !isNaN(chainId))
                    .map((chainId) => {
                        return (
                            <MUI.MenuItem key={chainId} value={chainId}>
                                {ChainName[chainId]}
                            </MUI.MenuItem>
                        )
                    })}
            </MUI.Select>
        </MUI.FormControl>
    )
}

const PostBulkActionButtons = (props: {
    vaults: TreasuryManagementVaultData[]
    setVaults: Dispatch<React.SetStateAction<TreasuryManagementVaultData[]>>
}) => {
    const { selectedIds, resource } = useListContext()
    const unselect = useUnselect(resource)

    console.log({ selectedIds })
    const deleteVaults = () => {
        const trimmedVaults = props.vaults.filter((v) => {
            return !selectedIds.includes(v.id)
        })
        props.setVaults(trimmedVaults)
        unselect(selectedIds)
    }

    return (
        <React.Fragment>
            <Button onClick={() => deleteVaults()}>
                <DeleteIcon />
                Delete
            </Button>
        </React.Fragment>
    )
}

type TreasuryManagementVaultData = (COLLATERAL | COLLATERAL_V2 | GAUGE_VALID_COLLATERAL | GAUGE_VALID_COLLATERAL_V2) & {
    depositedCollateralAmount: number
    id: string | number
    vaultIdx: number
}

const fetchVaultZeroes = async (
    chainId: ChainId,
    collaterals: (COLLATERAL | COLLATERAL_V2 | GAUGE_VALID_COLLATERAL | GAUGE_VALID_COLLATERAL_V2)[]
) => {
    await init()
    const VAULT_IDX = 0
    const depositedCollateralCalls = collaterals.map((c) => {
        const abi = DISCRIMINATOR_TO_ABI[c.discriminator]
        const vaultContract = new Contract(c.vaultAddress, abi as any)
        return vaultContract.vaultCollateral(VAULT_IDX)
    })
    const collateralValueCalls = collaterals.map((c) => {
        const abi = DISCRIMINATOR_TO_ABI[c.discriminator]
        const vaultContract = new Contract(c.vaultAddress, abi as any)
        return vaultContract.getEthPriceSource()
    })

    const allTheMulticalled = await multicall3(chainId, [...depositedCollateralCalls, ...collateralValueCalls])

    const depositedCollaterals = allTheMulticalled.slice(0, collaterals.length)
    const collateralValues = allTheMulticalled.slice(collaterals.length, collaterals.length * 2)

    const vaultOwnerCalls = collaterals.map((c) => {
        let vaultContract: Contract
        let vaultAddress: string
        if (c.vaultAddress !== OG_MATIC_VAULT) {
            vaultAddress = c.vaultAddress
            const abi = DISCRIMINATOR_TO_ABI[c.discriminator]
            vaultContract = new Contract(vaultAddress, abi as any)
        } else {
            vaultAddress = '0x6AF1d9376a7060488558cfB443939eD67Bb9b48d'
            vaultContract = new Contract(vaultAddress, Erc20QiStablecoin__factory.abi as any)
        }
        return vaultContract.ownerOf(VAULT_IDX)
    })
    const vaultOwners = await multicall<string>(chainId, vaultOwnerCalls)
    const map = collaterals.map((c, i) => {
        const depositedCollateralAmount = (depositedCollaterals[i] as unknown as number) / 10 ** c.token.decimals
        const collateralValue = (collateralValues[i] as unknown as number) / 10 ** 8
        const owner = vaultOwners[i]
        return {
            ...c,
            owner,
            depositedCollateralAmount,
            collateralValue: collateralValue,
            id: getId(c, VAULT_IDX),
            vaultIdx: VAULT_IDX,
        }
    })
    console.log({ map })
    return map
}

const isBeefyZappable = (vaultAddress: string) => {
    const zapVaultKeys = Object.values(ZAP_META).flat()
    const zapZappableVaultsAddresses = zapVaultKeys.map(Object.keys).flat()

    return zapZappableVaultsAddresses.includes(vaultAddress)
}

const isCamZappable = (vaultAddress: string) => {
    const camVaultKeys = Object.values(CAM_META).flat()
    const camZappableVaultsAddresses = camVaultKeys.map(Object.keys).flat()

    return camZappableVaultsAddresses.includes(vaultAddress)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isZappable = (vaultAddress: string) => {
    return isBeefyZappable(vaultAddress) || isCamZappable(vaultAddress)
}

const TreasuryAdmin = () => {
    const [selectedChainId, setSelectedChainId] = useState(ChainId.MATIC)

    // const [safeSdk, setSafeSdk] = useState<Safe>();
    // const [safeService, setSafeService] = useState<SafeServiceClient>();
    let metamaskProvider = useProvider()
    const [vaults, setVaults] = useState<TreasuryManagementVaultData[]>([])
    useEffect(() => {
        const fetchAllChainsVaultZeros = async () => {
            try {
                const vaultZeros = await Promise.allSettled(
                    Object.keys(COLLATERALS).map((cId) => {
                        const chainId = parseInt(cId) as ChainId
                        if (!isEmpty(COLLATERALS[chainId])) return fetchVaultZeroes(chainId, COLLATERALS[chainId])
                        else return []
                    })
                )
                setVaults(vaultZeros.flatMap((v) => (v.status === 'fulfilled' ? v.value : [])))
            } catch (e) {
                console.error('shit blew up', e)
            }
        }
        void fetchAllChainsVaultZeros()
    }, [])

    async function generateVaultTx(vault: TreasuryManagementVaultData): Promise<TxForTxBuilder[]> {
        if (vault && metamaskProvider) {
            try {
                const vaultContract = vault.connect(vault.vaultAddress, metamaskProvider)
                if (isCamZappable(vault.vaultAddress)) {
                    const camZapperAddress = CAMZAPPER_ADDRESS[ChainId.MATIC]
                    if (camZapperAddress) {
                        const camZapperContract = CamZapper__factory.connect(camZapperAddress, metamaskProvider)
                        const camMeta = CAM_META[vault.chainId]?.[vault.vaultAddress]
                        if (camMeta) {
                            const approveTx = await vaultContract.populateTransaction.approve(camZapperAddress, vault.vaultIdx)
                            const zapTx = await camZapperContract.populateTransaction.camZapFromVault(
                                ethers.utils.parseUnits(vault.depositedCollateralAmount.toString(), vault.token.decimals),
                                vault.vaultIdx,
                                camMeta.underlying.address,
                                camMeta.amTokenAddress,
                                camMeta.camTokenAddress,
                                vault.vaultAddress
                            )
                            return [
                                {
                                    description: `Approve ${vault.token.name} w/ Zapper`,
                                    raw: {
                                        to: vault.vaultAddress,
                                        value: '0',
                                        data: approveTx.data || '',
                                    },
                                },
                                {
                                    description: `${vault.token.name} zap from ${ChainName[vault.chainId]}`,
                                    raw: {
                                        to: camZapperAddress,
                                        value: '0',
                                        data: zapTx.data || '',
                                    },
                                },
                            ]
                        }
                    }
                } else if (isBeefyZappable(vault.vaultAddress)) {
                    let beefyZapperAddress: string | undefined
                    switch (vault.chainId) {
                        case ChainId.AVALANCHE:
                            beefyZapperAddress = AVAX_ZAPPER_ADDRESS
                            break
                        case ChainId.FANTOM:
                            beefyZapperAddress = FTM_ZAPPER_ADDRESS
                            break
                    }
                    if (beefyZapperAddress) {
                        const beefyZapperContract = BeefyZapper__factory.connect(beefyZapperAddress, metamaskProvider)
                        const zapMeta = ZAP_META[vault.chainId]?.[vault.vaultAddress]
                        if (zapMeta) {
                            const approveTx = await vaultContract.populateTransaction.approve(beefyZapperAddress, vault.vaultIdx)
                            const zapTx = await beefyZapperContract.populateTransaction.beefyZapFromVault(
                                ethers.utils.parseUnits(vault.depositedCollateralAmount.toString(), vault.token.decimals),
                                vault.vaultIdx,
                                zapMeta.underlying.address,
                                zapMeta.mooAssetAddress,
                                vault.vaultAddress
                            )
                            return [
                                {
                                    description: `Approve ${vault.token.name} w/ Zapper`,
                                    raw: {
                                        to: vault.vaultAddress,
                                        value: '0',
                                        data: approveTx.data || '',
                                    },
                                },
                                {
                                    description: `${vault.token.name} zap from ${ChainName[vault.chainId]}`,
                                    raw: {
                                        to: beefyZapperAddress,
                                        value: '0',
                                        data: zapTx.data || '',
                                    },
                                },
                            ]
                        }
                    }
                } else {
                    const foo = await (vaultContract as Erc20Stablecoin).populateTransaction.withdrawCollateral(
                        vault.vaultIdx,
                        ethers.utils.parseUnits(vault.depositedCollateralAmount.toString(), vault.token.decimals)
                    )
                    return [
                        {
                            description: `${vault.token.name} withdrawl from ${ChainName[vault.chainId]}`,
                            raw: {
                                to: vault.vaultAddress,
                                value: '0',
                                data: foo.data || '',
                            },
                        },
                    ]
                }
            } catch (e) {
                console.warn({ e })
                return []
            }
        }
        return []
    }

    const a = async () => {
        const vaultWithdrawTxs: TxForTxBuilder[] = (
            await Promise.all(
                vaults?.filter((v) => v.chainId === selectedChainId)?.map(async (vault) => (await generateVaultTx(vault))?.flat())
            )
        ).flat()

        if (!_.isEmpty(vaultWithdrawTxs)) {
            const vaultTxs = vaultWithdrawTxs.filter((item): item is TxForTxBuilder => !!item)
            console.log({ vaultTxs })
            saveTemplateAsJsonFile(`${selectedChainId}-withdraw-txes.json`, vaultTxs)
        }
    }
    const listContext = useList({
        data: vaults?.filter((v) => v.chainId === selectedChainId) || [],
    })
    console.log(listContext.data)
    return (
        <div>
            <>
                <button onClick={() => a()}>Generate and download TX</button>
                <ChainSelector selectedChainId={selectedChainId} setSelectedChainId={setSelectedChainId} />
                <ListContextProvider value={listContext}>
                    <Datagrid bulkActionButtons={<PostBulkActionButtons vaults={vaults || []} setVaults={setVaults} />}>
                        <TextField source="vaultIdx" />
                        <TextField source="id" />
                        <EditiableRow source="depositedCollateralAmount" vaults={vaults || []} setVaults={setVaults} />
                        <NumberField source="collateralValue" />

                        <TextField source="token.name" />
                        <AddressField source="owner" />
                    </Datagrid>
                </ListContextProvider>
            </>
        </div>
    )
}

export default TreasuryAdmin
