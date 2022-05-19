import React, {useEffect, useLayoutEffect, useState} from 'react';
import './App.css';
import {
    Admin,
    AdminContext,
    AdminUI,
    Datagrid,
    DataProvider,
    defaultI18nProvider,
    defaultTheme,
    LegacyDataProvider,
    List,
    ListGuesser,
    localStorageStore,
    Resource,
    TextField,
    useDataProvider,
    useNotify, useRefresh,
} from 'react-admin';
import fakeDataProvider from 'ra-data-fakerest'
import {ChainId} from "./constants";
import {ContractMeta, Contracts} from "./ContractMetas";
import {init} from './multicall'
import {fetchVaultInfo} from "./vaultInfo";
import localStorageDataProvider from 'ra-data-local-storage';

const theme = {
    ...defaultTheme,
    palette: {
        type: 'dark', // Switching the dark mode on is a single property value change.
    },
};
const chainId = ChainId.MATIC
const contractMetas: ContractMeta[] | undefined = Contracts[chainId]

const VaultList: React.FC = () => {
    return (<List>
        <Datagrid>
            <TextField source="tokenName" />
            <TextField source="vaultIdx" />
            <TextField source="owner" />
            <TextField source="collateral" />
            <TextField source="debt" />
            <TextField source="cdr" />
        </Datagrid>
    </List>)
}

const DataDisplay: React.FC<{vaultData: {vaults: VaultInfo[][]}}> = ({vaultData} ) => {
    const currentVaultData = vaultData.vaults[0]
    const dataProvider = fakeDataProvider(currentVaultData? {vaults:currentVaultData}: {vaults:[]})
    return (
        <Admin dataProvider={dataProvider}>
            <Resource name={"vaults"} list={ListGuesser}/>
        </Admin>
    );
}

const App = () => {

    return <DataDisplay/>;
};

export default App;