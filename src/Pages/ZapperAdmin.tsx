import LoadingButton from '@mui/lab/LoadingButton'
import { MenuItem, Select, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { AVAX_ZAPPER_ADDRESS, CAMZAPPER_ADDRESS, ChainId, FTM_ZAPPER_ADDRESS } from '@qidao/sdk'
import { PopulatedTransaction } from 'ethers'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useChainId, useProvider } from '../Connectors/Metamask'
import { BeefyZapper, BeefyZapper__factory, CamZapper, CamZapper__factory } from '../contracts'
import { saveTemplateAsJsonFile } from '../utils/files'

type Zapper = CamZapper | BeefyZapper

function isBeefyZapper(z: Zapper | undefined): z is BeefyZapper {
    return (z as BeefyZapper)?.beefyZapFromVault !== undefined
}

function isCamZapper(z: Zapper | undefined): z is CamZapper {
    return (z as CamZapper)?.camZapToVault !== undefined
}

interface IBeefyZapperForm {
    shouldAdd: 'add' | 'remove'
    _asset: string
    _mooAsset: string
    _mooAssetVault: string
}

interface ICamZapperForm {
    shouldAdd: 'add' | 'remove'
    _asset: string
    _amAsset: string
    _camAsset: string
    _camAssetVault: string
}

const BeefyZapperForm: React.FC<{ zapper: BeefyZapper }> = ({ zapper }) => {
    const { control, handleSubmit } = useForm<IBeefyZapperForm>()
    const onSubmit: SubmitHandler<IBeefyZapperForm> = async (data) => {
        let tx: PopulatedTransaction
        if (data.shouldAdd === 'add')
            tx = await zapper.populateTransaction.addChainToWhiteList(data._asset, data._mooAsset, data._mooAssetVault)
        else tx = await zapper.populateTransaction.removeChainFromWhiteList(data._asset, data._mooAsset, data._mooAssetVault)
        const GnosisTx = [
            {
                description: `${data.shouldAdd} Beefy Asset Chain`,
                raw: {
                    to: zapper.address,
                    value: '0',
                    data: tx.data || '',
                },
            },
        ]
        saveTemplateAsJsonFile(`${zapper.address}-beefy-zapper-${data.shouldAdd}-tx.json`, GnosisTx)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container>
                <Grid xs={2}>
                    <LoadingButton variant="contained" type="submit">
                        Submit
                    </LoadingButton>
                </Grid>
                <Grid xs={10}>
                    <Controller
                        name={'shouldAdd'}
                        control={control}
                        defaultValue={'add'}
                        render={({ field }) => (
                            <Select {...field} variant="outlined" label={'Adding or Removing'}>
                                <MenuItem value={'add'}>Add</MenuItem>
                                <MenuItem value={'remove'}>Remove</MenuItem>
                            </Select>
                        )}
                    />
                </Grid>
                <Grid xs={12}>
                    <Controller
                        name={'_asset'}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <TextField {...field} variant="outlined" label={'Underlying Asset Address'} />}
                    />
                </Grid>
                <Grid xs={12}>
                    <Controller
                        name={'_mooAsset'}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <TextField {...field} variant="outlined" label={'MooAsset Address'} />}
                    />
                </Grid>
                <Grid xs={12}>
                    <Controller
                        name={'_mooAssetVault'}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <TextField {...field} variant="outlined" label={'Vault Address'} />}
                    />
                </Grid>
            </Grid>
        </form>
    )
}

const CamZapperForm: React.FC<{ zapper: CamZapper }> = ({ zapper }) => {
    const { control, handleSubmit } = useForm<ICamZapperForm>()
    const onSubmit: SubmitHandler<ICamZapperForm> = async (data) => {
        let tx: PopulatedTransaction
        if (data.shouldAdd === 'add')
            tx = await zapper.populateTransaction.addChainToWhiteList(data._asset, data._amAsset, data._camAsset, data._camAssetVault)
        else tx = await zapper.populateTransaction.removeChainFromWhiteList(data._asset, data._amAsset, data._camAsset, data._camAssetVault)
        const GnosisTx = [
            {
                description: `${data.shouldAdd} Cam Asset Chain`,
                raw: {
                    to: zapper.address,
                    value: '0',
                    data: tx.data || '',
                },
            },
        ]

        saveTemplateAsJsonFile(`${zapper.address}-cam-zapper-${data.shouldAdd}-tx.json`, GnosisTx)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container>
                <Grid xs={2}>
                    <LoadingButton variant="contained" type="submit">
                        Submit
                    </LoadingButton>
                </Grid>
                <Grid xs={10}>
                    <Controller
                        name={'shouldAdd'}
                        control={control}
                        defaultValue={'add'}
                        render={({ field }) => (
                            <Select {...field} variant="outlined" label={'Adding or Removing'}>
                                <MenuItem value={'add'}>Add</MenuItem>
                                <MenuItem value={'remove'}>Remove</MenuItem>
                            </Select>
                        )}
                    />
                </Grid>
                <Grid xs={12}>
                    <Controller
                        name={'_asset'}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <TextField {...field} variant="outlined" label={'Underlying Asset Address'} />}
                    />
                </Grid>
                <Grid xs={12}>
                    <Controller
                        name={'_amAsset'}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <TextField {...field} variant="outlined" label={'amAsset Address'} />}
                    />
                </Grid>
                <Grid xs={12}>
                    <Controller
                        name={'_camAsset'}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <TextField {...field} variant="outlined" label={'CamAsset Address'} />}
                    />
                </Grid>
                <Grid xs={12}>
                    <Controller
                        name={'_camAssetVault'}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <TextField {...field} variant="outlined" label={'Vault Address'} />}
                    />
                </Grid>
            </Grid>
        </form>
    )
}

export default function ZapperAdmin() {
    const chainId = useChainId()
    const provider = useProvider()
    let zapper: Zapper | undefined

    if (chainId && provider) {
        switch (chainId) {
            case ChainId.MATIC:
                const zapperAddress = CAMZAPPER_ADDRESS[chainId]
                if (zapperAddress) zapper = CamZapper__factory.connect(zapperAddress, provider)
                break
            case ChainId.FANTOM:
                zapper = BeefyZapper__factory.connect(FTM_ZAPPER_ADDRESS, provider)
                break
            case ChainId.AVALANCHE:
                zapper = BeefyZapper__factory.connect(AVAX_ZAPPER_ADDRESS, provider)
                break
        }
    }

    return (
        <Grid container>
            <Grid xs={12}>
                {isBeefyZapper(zapper) ? (
                    <BeefyZapperForm zapper={zapper} />
                ) : isCamZapper(zapper) ? (
                    <CamZapperForm zapper={zapper} />
                ) : (
                    <span>No Zapper available on chain</span>
                )}
            </Grid>
        </Grid>
    )
}
