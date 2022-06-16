import React from 'react'
import { TextInput, useTranslate} from 'react-admin'
import {Chip} from "@mui/material";

interface filterProps {
    label: string
    source: string
    defaultValue: number | boolean
}

const QuickFilter: React.FC<filterProps> = ({label}) => {
    const translate = useTranslate();
    return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};
const searchFilters = [
    <TextInput label="Search" source="q" alwaysOn />,
    <QuickFilter label="Has Collateral" source="collateral_gt" defaultValue={0} />,
    <QuickFilter label="Has Debt" source="debt_gt" defaultValue={0} />,
    // <QuickFilter label="Under-collateralized" source="cdr_lte" defaultValue={110}/>
];

export default searchFilters