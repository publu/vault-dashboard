import React from "react";
import {Datagrid, List, NumberField, TextField} from "react-admin";
import LoadingDisplay from "./LoadingDisplay";
import searchFilters from "./Search";

const VaultList: React.FC = () => {
    return (<List empty={<LoadingDisplay/>} queryOptions={{refetchInterval: 1000}} filters={searchFilters}>
        <Datagrid>
            <TextField source="tokenName"/>
            <NumberField source="vaultIdx"/>
            <TextField source="owner"/>
            <NumberField source="collateral" options={{style: 'decimal'}}/>
            <NumberField source="debt" options={{ style: 'currency', currency: 'USD' }}/>
            <NumberField source="cdr" options={{style: 'percent'}}/>
        </Datagrid>
    </List>)
}

export default VaultList