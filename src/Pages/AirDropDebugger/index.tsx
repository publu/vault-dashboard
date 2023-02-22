//add empty div default export
import LoadingButton from '@mui/lab/LoadingButton'
import { TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { ethers } from 'ethers'
import _ from 'lodash'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { JSONTree } from 'react-json-tree'
import { OwnerDataByCollateralAndVault, OwnerDataByCollateralAndVaultUnparsed, scaryParseJsonFn } from './utils'

interface IJsonUrlForm {
    airdropJsonBlobUrl: string
    addressToFilter: string
}

const FormField: React.FC<{ name: keyof IJsonUrlForm }> = (props) => {
    const { control } = useFormContext<IJsonUrlForm>()
    return (
        <Grid xs={12}>
            <Controller
                name={props.name}
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} variant="outlined" label={props.name} />}
            />
        </Grid>
    )
}

export default function AirDropDebugger() {
    const methods = useForm<IJsonUrlForm>({
        defaultValues: {
            airdropJsonBlobUrl: 'ownerByVaultReward.json',
        },
    })
    const addressToFilter = methods.getValues().addressToFilter

    const [jsonBlob, setJsonBlob] = useState<OwnerDataByCollateralAndVault>({})
    const [filteredJson, setFilteredJson] = useState<OwnerDataByCollateralAndVault>({})
    const onSubmit = async (data: IJsonUrlForm) => {
        const res = await fetch(data.airdropJsonBlobUrl)
        const json: OwnerDataByCollateralAndVaultUnparsed = await res.json()
        setJsonBlob(scaryParseJsonFn(json))
    }

    const numberOfQualifiedPeriods = Object.fromEntries(
        Object.entries(filteredJson).map(([collateral, owners]) => {
            return [
                collateral,
                Object.fromEntries(
                    Object.entries(owners).map(([owner, vault]) => {
                        return [
                            owner,
                            Object.fromEntries(
                                Object.entries(vault).map(([vaultId, vaultData]) => {
                                    return [vaultId, Object.values(vaultData).filter((x) => Number(x.debtAtBlock) > 0)]
                                })
                            ),
                        ]
                    })
                ),
            ]
        })
    )

    useEffect(() => {
        if (_.isEmpty(addressToFilter)) setFilteredJson(jsonBlob)
        else
            setFilteredJson(
                Object.fromEntries(
                    Object.entries(jsonBlob)
                        .map(([key, value]) => {
                            const checksumAddress = ethers.utils.getAddress(addressToFilter)
                            if (_.isEmpty(value[checksumAddress])) return
                            else return [key, { [addressToFilter]: value[checksumAddress] }]
                        })
                        .filter(Boolean)
                )
            )
    }, [jsonBlob, methods.getValues().addressToFilter])

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Grid display="flex" justifyContent="center" alignItems="center" container>
                    <Grid display={'flex'} xs={12}>
                        <FormField name="airdropJsonBlobUrl" />
                        <FormField name="addressToFilter" />
                    </Grid>
                    <Grid xs={12}>
                        <LoadingButton variant="contained" type="submit">
                            Submit
                        </LoadingButton>
                    </Grid>
                    <Grid display="flex" xs={12}>
                        <Grid xs={6}>
                            {/*<ReactJson src={jsonBlob} theme="monokai" />*/}
                            <JSONTree
                                shouldExpandNodeInitially={(keyPath) => !_.isEmpty(addressToFilter)}
                                data={numberOfQualifiedPeriods}
                            />
                        </Grid>
                        <Grid xs={6}>
                            {/*<ReactJson src={jsonBlob} theme="monokai" />*/}
                            <JSONTree shouldExpandNodeInitially={(keyPath) => !_.isEmpty(addressToFilter)} data={filteredJson} />
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </FormProvider>
    )
}
