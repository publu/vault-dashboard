import LoadingButton from '@mui/lab/LoadingButton'
import { CircularProgress, TextField } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Unstable_Grid2'
import { ChainId, COLLATERALS, OG_MATIC_VAULT } from '@qidao/sdk'
import { BigNumber } from 'ethers'
import _ from 'lodash/fp'
import React, { createContext, useContext, useEffect, useState } from 'react'
import CollateralSelector from '../components/common/CollateralSelector'
import { isSlimContract, isV2Contract, TxForTxBuilder, VaultContract } from '../components/types'
import { useChainId, useProvider } from '../Connectors/Metamask'
import { saveTemplateAsJsonFile } from '../utils/files'
import { extractIPFSCID } from '../utils/urls'

interface VaultAdminContextInterface {
    includeInTx: {
        burn: boolean
        changeEthPriceSource: boolean
        setAdmin: boolean
        setGainRatio: boolean
        setInterestRate: boolean
        setMaxDebt: boolean
        setMinDebt: boolean
        setOpeningFee: boolean
        setRef: boolean
        setTokenURI: boolean
    }
    formValues: {
        burn: null | BigNumber
        changeEthPriceSource: null | string
        setAdmin: null | string
        setGainRatio: null | BigNumber
        setInterestRate: null | BigNumber
        setMaxDebt: null | BigNumber
        setMinDebt: null | BigNumber
        setOpeningFee: null | BigNumber
        setRef: null | string
        setTokenURI: null | string
    }
}

const defaultVaultAdminContext: VaultAdminContextInterface = {
    includeInTx: {
        burn: false,
        changeEthPriceSource: false,
        setAdmin: false,
        setGainRatio: false,
        setInterestRate: false,
        setMaxDebt: false,
        setMinDebt: false,
        setOpeningFee: false,
        setRef: false,
        setTokenURI: false,
    },
    formValues: {
        burn: null,
        changeEthPriceSource: null,
        setAdmin: null,
        setGainRatio: null,
        setInterestRate: null,
        setMaxDebt: null,
        setMinDebt: null,
        setOpeningFee: null,
        setRef: null,
        setTokenURI: null,
    },
}
const VaultAdminContext = createContext<VaultAdminContextInterface>(defaultVaultAdminContext)

const VaultAdminDispatchContext = createContext<
    ((value: ((prevState: VaultAdminContextInterface) => VaultAdminContextInterface) | VaultAdminContextInterface) => void) | null
>(null)

function useVaultAdminContext() {
    return useContext(VaultAdminContext)
}

function useVaultAdminDispatchContext() {
    return useContext(VaultAdminDispatchContext)
}

enum VaultAdminSetMethod {
    'changeEthPriceSource' = 'changeEthPriceSource',
    'setGainRatio' = 'setGainRatio',
    'setOpeningFee' = 'setOpeningFee',
    'setTokenURI' = 'setTokenURI',
    'setMinDebt' = 'setMinDebt',
    'setMaxDebt' = 'setMaxDebt',
    'setRef' = 'setRef',
    'setAdmin' = 'setAdmin',
    'burn' = 'burn',
    'setInterestRate' = 'setInterestRate',
}

const Field: React.FC<{
    vaultContract: VaultContract
    label: string
    vaultMethod: VaultAdminSetMethod
    decimals: number
}> = ({ vaultContract, label, vaultMethod }) => {
    const setFormState = useVaultAdminDispatchContext()
    const currentFormState = useVaultAdminContext()

    function modifyFormState(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        if (setFormState) {
            setFormState(
                _.merge(currentFormState, {
                    formValues: { [vaultMethod]: e.target.value },
                })
            )
        }
    }

    if (!(vaultMethod in vaultContract)) {
        return <></>
    } else {
        return (
            <>
                <Grid xs={1}>
                    <Checkbox
                        checked={currentFormState.includeInTx[vaultMethod]}
                        onChange={(event) => {
                            if (setFormState) {
                                setFormState(
                                    _.merge(currentFormState, {
                                        includeInTx: { [vaultMethod]: event.target.checked },
                                    })
                                )
                            }
                        }}
                    />
                </Grid>

                <Grid xs={11}>
                    <TextField
                        id="outlined-basic"
                        label={label}
                        value={currentFormState.formValues[vaultMethod] || ''}
                        onChange={(e) => {
                            modifyFormState(e)
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
            </>
        )
    }
}

interface VaultValues {
    ethPriceSource: null | string
    gainRatio: null | BigNumber
    openingFee: null | BigNumber
    minDebt: null | BigNumber
    maxDebt: null | BigNumber
    ref: null | string
    adm: null | string
    interestRate: null | BigNumber
    tokenURI: null | string
}

const generateTx = async (vaultContract: VaultContract, context: VaultAdminContextInterface) => {
    type FormValueKey = keyof VaultAdminContextInterface['formValues']
    const ks: FormValueKey[] = Object.keys(context.formValues) as FormValueKey[]

    const txs: (TxForTxBuilder | null)[] = await Promise.all(
        ks.map(async (k) => {
            const formValue = context.formValues[k]
            const includeInTx = context.includeInTx[k]
            if (formValue) {
                switch (k) {
                    case 'burn':
                        if (k in vaultContract && includeInTx)
                            if (isV2Contract(vaultContract) || isSlimContract(vaultContract))
                                return {
                                    description: `${k} to ${formValue}`,
                                    raw: {
                                        to: vaultContract.address,
                                        value: '0',
                                        data: (await vaultContract.populateTransaction[k](formValue.toString())).data || '',
                                    },
                                }
                        break
                    case 'changeEthPriceSource':
                        if (k in vaultContract && includeInTx)
                            return {
                                description: `${k} to ${formValue}`,
                                raw: {
                                    to: vaultContract.address,
                                    value: '0',
                                    data: (await vaultContract.populateTransaction[k](formValue.toString())).data || '',
                                },
                            }
                        break
                    case 'setAdmin':
                        if (k in vaultContract && includeInTx)
                            return {
                                description: `${k} to ${formValue}`,
                                raw: {
                                    to: vaultContract.address,
                                    value: '0',
                                    data: ((await vaultContract.populateTransaction[k](formValue.toString())) || '').data || '',
                                },
                            }
                        break
                    case 'setGainRatio':
                        if (k in vaultContract && includeInTx)
                            return {
                                description: `${k} to ${formValue}`,
                                raw: {
                                    to: vaultContract.address,
                                    value: '0',
                                    data: ((await vaultContract.populateTransaction[k](formValue.toString())) || '').data || '',
                                },
                            }
                        break
                    case 'setInterestRate':
                        if (k in vaultContract && includeInTx)
                            return {
                                description: `${k} to ${formValue}`,
                                raw: {
                                    to: vaultContract.address,
                                    value: '0',
                                    data: ((await vaultContract.populateTransaction[k](formValue.toString())) || '').data || '',
                                },
                            }
                        break
                    case 'setMaxDebt':
                        if (k in vaultContract && includeInTx)
                            return {
                                description: `${k} to ${formValue}`,
                                raw: {
                                    to: vaultContract.address,
                                    value: '0',
                                    data: ((await vaultContract.populateTransaction[k](formValue.toString())) || '').data || '',
                                },
                            }
                        break
                    case 'setMinDebt':
                        if (k in vaultContract && includeInTx)
                            return {
                                description: `${k} to ${formValue}`,
                                raw: {
                                    to: vaultContract.address,
                                    value: '0',
                                    data: ((await vaultContract.populateTransaction[k](formValue.toString())) || '').data || '',
                                },
                            }
                        break
                    case 'setOpeningFee':
                        if (k in vaultContract && includeInTx)
                            return {
                                description: `${k} to ${formValue}`,
                                raw: {
                                    to: vaultContract.address,
                                    value: '0',
                                    data: ((await vaultContract.populateTransaction[k](formValue.toString())) || '').data || '',
                                },
                            }
                        break
                    case 'setRef':
                        if (k in vaultContract && includeInTx)
                            return {
                                description: `${k} to ${formValue}`,
                                raw: {
                                    to: vaultContract.address,
                                    value: '0',
                                    data: ((await vaultContract.populateTransaction[k](formValue.toString())) || '').data || '',
                                },
                            }
                        break
                    case 'setTokenURI':
                        if (k in vaultContract && includeInTx)
                            return {
                                description: `${k} to ${formValue}`,
                                raw: {
                                    to: vaultContract.address,
                                    value: '0',
                                    data: ((await vaultContract.populateTransaction[k](formValue.toString())) || '').data || '',
                                },
                            }
                        break
                }
            }
            return null
        })
    )
    const someTxs = txs.flatMap((x) => (x ? [x] : []))
    saveTemplateAsJsonFile(`${vaultContract.address}-admin-txes.json`, someTxs)
}

export default function VaultAdminPanel() {
    const metamaskProvider = useProvider()
    const chainId = useChainId() as ChainId
    const [collateral, setCollateral] = useState(COLLATERALS[chainId]?.[0])
    const [imagePreview, setImagePreview] = useState<string | undefined>()
    const [jsonPreview, setJsonPreview] = useState<string | undefined>()
    const [loading, setLoading] = useState(false)
    const [vaultAdminContextState, setVaultAdminContextState] = useState<VaultAdminContextInterface>(defaultVaultAdminContext)

    useEffect(() => {
        if (collateral && metamaskProvider) {
            const vaultContract = collateral.connect(collateral.vaultAddress, metamaskProvider)

            const fetchVaultValues = async () => {
                setLoading(true)
                setVaultAdminContextState(defaultVaultAdminContext)
                let calls: VaultValues = {
                    adm: null,
                    ethPriceSource: null,
                    gainRatio: null,
                    interestRate: null,
                    maxDebt: null,
                    minDebt: null,
                    openingFee: null,
                    ref: null,
                    tokenURI: null,
                }

                if (isV2Contract(vaultContract)) {
                    calls = {
                        ...calls,
                        maxDebt: await vaultContract.maxDebt(),
                        ref: await vaultContract.ref(),
                        adm: await vaultContract.adm(),
                        interestRate: await vaultContract.iR(),
                    }
                }
                if (isSlimContract(vaultContract)) {
                    try {
                        calls = {
                            ...calls,
                            minDebt: await vaultContract.minDebt(),
                        }
                    } catch (e: any) {
                        console.warn(`Failed to fetch minDebt from ${vaultContract.address}})`)
                    }
                }

                if ('openingFee' in vaultContract) {
                    try {
                        calls = { ...calls, openingFee: await vaultContract.openingFee() }
                    } catch (e: any) {
                        console.warn(`Failed to fetch openingFee from ${vaultContract.address}})`)
                    }
                }

                if ('tokenURI' in vaultContract && vaultContract.address !== OG_MATIC_VAULT) {
                    try {
                        calls = { ...calls, tokenURI: await vaultContract.tokenURI(0) }
                    } catch (e: any) {
                        console.warn(`Failed to fetch tokenURI from ${vaultContract.address}})`)
                    }
                }
                if ('gainRatio' in vaultContract && vaultContract.address !== OG_MATIC_VAULT) {
                    try {
                        calls = { ...calls, gainRatio: await vaultContract.gainRatio() }
                    } catch (e: any) {
                        console.warn(`Failed to fetch gainRatio from ${vaultContract.address}})`)
                    }
                }

                calls = {
                    ...calls,
                    ethPriceSource: await vaultContract.ethPriceSource(),
                }
                setVaultAdminContextState({
                    includeInTx: { ...vaultAdminContextState.includeInTx },
                    formValues: {
                        burn: BigNumber.from(0),
                        changeEthPriceSource: calls.ethPriceSource,
                        setAdmin: calls.adm,
                        setGainRatio: calls.gainRatio,
                        setInterestRate: calls.interestRate,
                        setMaxDebt: calls.maxDebt,
                        setMinDebt: calls.minDebt,
                        setOpeningFee: calls.openingFee,
                        setRef: calls.ref,
                        setTokenURI: calls.tokenURI,
                    },
                })
                setLoading(false)
            }

            void fetchVaultValues()
        }
    }, [collateral, metamaskProvider, vaultAdminContextState.includeInTx])

    useEffect(() => {
        const fetchIPFSContent = async () => {
            const CID = extractIPFSCID(vaultAdminContextState.formValues.setTokenURI || '')
            if (CID === '') return null
            else {
                const res = await fetch(`https://dweb.link/ipfs/${CID}`)
                const blob = await res.blob()
                try {
                    const json = JSON.parse(await blob.text())
                    setJsonPreview(json)
                    setImagePreview(undefined)
                } catch (e: any) {
                    setJsonPreview(undefined)
                    setImagePreview(URL.createObjectURL(blob))
                }
                return res
            }
        }
        void fetchIPFSContent()
    }, [vaultAdminContextState.formValues.setTokenURI])

    if (collateral && metamaskProvider) {
        const vaultContract = collateral.connect(collateral.vaultAddress, metamaskProvider)

        return (
            <VaultAdminDispatchContext.Provider value={setVaultAdminContextState}>
                <VaultAdminContext.Provider value={vaultAdminContextState}>
                    <Grid container spacing={2}>
                        <Grid xs={4}>
                            <CollateralSelector selectedCollateral={collateral} setSelectedCollateral={setCollateral} />
                        </Grid>
                        <Grid xs={6} />
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Grid xs={2}>
                                    <LoadingButton
                                        // disabled={titleError || submissionMade}
                                        // loading={submissionMade}
                                        variant="contained"
                                        onClick={() => generateTx(vaultContract, vaultAdminContextState)}
                                    >
                                        Submit
                                    </LoadingButton>
                                </Grid>

                                <Field
                                    vaultContract={vaultContract}
                                    label={'Gain Ratio'}
                                    vaultMethod={VaultAdminSetMethod.setGainRatio}
                                    decimals={2}
                                />
                                <Field
                                    vaultContract={vaultContract}
                                    label={'Min Debt'}
                                    vaultMethod={VaultAdminSetMethod.setMinDebt}
                                    decimals={2}
                                />
                                <Field
                                    vaultContract={vaultContract}
                                    label={'Max Debt'}
                                    vaultMethod={VaultAdminSetMethod.setMaxDebt}
                                    decimals={2}
                                />
                                <Field
                                    vaultContract={vaultContract}
                                    label={'Interest Rate'}
                                    vaultMethod={VaultAdminSetMethod.setInterestRate}
                                    decimals={2}
                                />
                                <Field
                                    vaultContract={vaultContract}
                                    label={'Opening Fee'}
                                    vaultMethod={VaultAdminSetMethod.setOpeningFee}
                                    decimals={2}
                                />
                                <Field vaultContract={vaultContract} label={'Burn'} vaultMethod={VaultAdminSetMethod.burn} decimals={2} />
                                <Field
                                    vaultContract={vaultContract}
                                    label={'Admin'}
                                    vaultMethod={VaultAdminSetMethod.setAdmin}
                                    decimals={2}
                                />
                                <Field
                                    vaultContract={vaultContract}
                                    label={'Price Source'}
                                    vaultMethod={VaultAdminSetMethod.changeEthPriceSource}
                                    decimals={2}
                                />
                                <Field vaultContract={vaultContract} label={'Ref'} vaultMethod={VaultAdminSetMethod.setRef} decimals={2} />
                                <Field
                                    vaultContract={vaultContract}
                                    label={'Token URI'}
                                    vaultMethod={VaultAdminSetMethod.setTokenURI}
                                    decimals={2}
                                />
                                <Grid xs={12}>
                                    {jsonPreview ? <pre>{JSON.stringify(jsonPreview, null, 2)}</pre> : <></>}
                                    {imagePreview ? <img style={{ maxWidth: '350px' }} src={imagePreview} alt={''} /> : <></>}
                                </Grid>
                            </>
                        )}
                    </Grid>
                </VaultAdminContext.Provider>
            </VaultAdminDispatchContext.Provider>
        )
    }
    return <></>
}
