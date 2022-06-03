import React from "react";
import { Button, Datagrid, List, NumberField, TextField} from "react-admin";
import LoadingDisplay from "./LoadingDisplay";
import searchFilters from "./Search";
import DashPagination from "./DashPagination"

const VaultList: React.FC = () => {
    return (<List perPage={100} pagination={<DashPagination />} empty={<LoadingDisplay/>} queryOptions={{refetchInterval: 1000}} filters={searchFilters}>
        <Datagrid>
            <TextField source="tokenName"/>
            <NumberField source="vaultIdx"/>
            <TextField source="owner"/>
            <NumberField source="collateral" options={{style: 'decimal'}}/>
            <NumberField source="debt" options={{ style: 'currency', currency: 'USD' }}/>
            <NumberField source="cdr" options={{style: 'percent'}}/>
            <Button label={"Liquidate"}/>
        </Datagrid>
    </List>)
}

export default VaultList