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
            <TextField source="tokenName"/>
            <TextField source="vaultIdx"/>
            <TextField source="owner"/>
            <TextField source="collateral"/>
            <TextField source="debt"/>
            <TextField source="cdr"/>
        </Datagrid>
    </List>)
}


const store = localStorageStore();

const DataDisplay: React.FC= () => {
    const [dataProvider, setDataProvider] = useState<DataProvider>();
    useLayoutEffect(() => {
        console.log("called useEffect")
        const effect = async () => {
            try {
                await init()

                console.log("called effect")

                console.log({contractMetas})
                const vaultInfoPromises = contractMetas?.map((contractMeta) => {
                    return fetchVaultInfo(chainId, contractMeta.address, contractMeta.abi)
                })
                console.log({vaultInfoPromises})

                if (vaultInfoPromises) {
                    const dataProvider = fakeDataProvider([]);
                    const vaults = await vaultInfoPromises[0]
                    vaults.map(v => {
                        dataProvider.create('vaults', {data:v})
                    })
                    setDataProvider(dataProvider)
                }
            } catch (e: any) {
                console.error(e)
            } finally {
                console.log("finished")
            }
        }

        void effect()
    }, [])

    return (
        <AdminContext dataProvider={dataProvider} i18nProvider={defaultI18nProvider} store={store}>
            <AdminUI>
                <Resource name={'vaults'} list={VaultList}/>
            </AdminUI>
        </AdminContext>
    );
}

const App = () => {

    return <DataDisplay/>;
};


export default App;