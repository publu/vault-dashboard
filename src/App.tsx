import React, {useEffect, useLayoutEffect, useState} from 'react';
import './App.css';
import {Admin, ListGuesser, Resource, List, Datagrid, TextField} from 'react-admin';
import fakeDataProvider from 'ra-data-fakerest'
import {ChainId} from "./constants";
import {ContractMeta, Contracts} from "./ContractMetas";
import { init } from './multicall'
import {fetchVaultInfo, VaultInfo} from "./vaultInfo";
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

    const [vaultData, setVaultData] = useState<{vaults: VaultInfo[][]}>({vaults: []});
    useEffect(() => {
        console.log("called useEffect")
        const effect = async () => {
            console.log("called effect")
            await init()
            const vaultInfoPromises = contractMetas?.slice(1).map((contractMeta) => {
                return fetchVaultInfo(chainId, contractMeta.address, contractMeta.abi)
            })
            if (vaultInfoPromises) {
                const vaults = await vaultInfoPromises[0] //Promise.all(vaultInfoPromises)
                setVaultData({vaults: [vaults]})
            }

        }
        void effect().then(() => {
            console.log("called")
        })
    }, [])
    return <DataDisplay vaultData={vaultData}/>;
};

export default App;