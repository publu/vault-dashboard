import React from "react";
import {Datagrid, List, NumberField, TextField} from "react-admin";
import LoadingDisplay from "./LoadingDisplay";
import searchFilters from "./Search";
import DashPagination from "./DashPagination"
import {TopToolbar, FilterButton, ExportButton} from "react-admin";
import {NetworkButton} from "./MetaMaskConnectButton";
import LiquidateButton from './LiquidateButton'

const ListActions = () => (
    <TopToolbar>
        <FilterButton/>
        <ExportButton/>
        <NetworkButton title={"Metamask"}/>
    </TopToolbar>
);

const VaultList: React.FC = () => {
    return (<List actions={<ListActions/>} perPage={100} pagination={<DashPagination />} empty={<LoadingDisplay/>}
                  queryOptions={{refetchInterval: 1000}} filters={searchFilters}>
        <Datagrid>
            <TextField source="vaultChainName"/>
            <TextField source="tokenName"/>
            <NumberField source="vaultIdx"/>
            <TextField source="owner"/>
            <NumberField source="collateral" options={{style: 'decimal'}}/>
            <NumberField source="debt" options={{ style: 'currency', currency: 'USD' }}/>
            <NumberField source="cdr" options={{style: 'percent'}}/>
            <LiquidateButton/>
        </Datagrid>
    </List>)
}

export default VaultList