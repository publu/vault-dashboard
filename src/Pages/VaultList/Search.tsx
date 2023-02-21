import { Chip } from '@mui/material'
import React from 'react'
import { NumberInput, TextInput, useTranslate } from 'react-admin'

interface filterProps {
    label: string
    source: string
    defaultValue: number | boolean
}

const QuickFilter: React.FC<filterProps> = ({ label }) => {
    const translate = useTranslate()
    return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />
}
const searchFilters = [
    <TextInput label="Search" source="q" alwaysOn />,
    <NumberInput source="debt_gte" label="Debt Greater Than" />,
    <NumberInput source="debt_lte" label="Debt Less Than" />,

    <QuickFilter label="Has Collateral" source="collateral_gt" defaultValue={0} />,
    <QuickFilter label="Has Debt" source="debt_gt" defaultValue={0} />,
    // <QuickFilter label="Under-collateralized" source="cdr_lte" defaultValue={110}/>
]

export default searchFilters
