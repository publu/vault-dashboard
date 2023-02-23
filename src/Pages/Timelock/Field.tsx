import { TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'

interface IFieldProps<T extends FieldValues> {
    name: Path<T>
    label?: string
}

export default function Field<T extends FieldValues>(props: IFieldProps<T>) {
    const { name, label } = props
    const {
        control,
        formState: { errors },
        unregister,
    } = useFormContext()

    useEffect(() => {
        return () => {
            unregister(name)
        }
    }, [name, unregister])

    return (
        <Grid xs={12}>
            <Controller
                rules={{ required: true }}
                render={({ field }) => {
                    return (
                        <TextField
                            {...field}
                            fullWidth
                            label={label || name.toString()}
                            error={!!_.get(errors, name)}
                            helperText={!_.get(errors, name) ? '' : `${label || name} is required`}
                            variant={'outlined'}
                        />
                    )
                }}
                name={name}
                control={control}
            />
        </Grid>
    )
}
