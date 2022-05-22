import React, {useLayoutEffect} from 'react';
import './App.css';
import {Admin, Datagrid, defaultTheme, List, NumberField, RaThemeOptions, Resource, TextField,} from 'react-admin';
import fakeDataProvider from 'ra-data-fakerest'
import {ChainId} from "./constants";
import {Contracts} from "./ContractMetas";
import {init} from './multicall'
import {fetchVaultInfo} from "./vaultInfo";

const theme = {
    ...defaultTheme,
    palette: {
        type: 'dark',
    },
};

const VaultList: React.FC = () => {
    return (<List queryOptions={{refetchInterval: 1000}}>
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

const DataDisplay: React.FC = () => {
    const dataProvider = fakeDataProvider({vaults:[]});
    useLayoutEffect(() => {
        console.log("called useEffect")
        const effect = async () => {
            await init()

            console.log("called effect")

            const chainIds = [
                ChainId.MATIC, ChainId.FANTOM,
                ChainId.AVALANCHE, ChainId.ARBITRUM, ChainId.MOONRIVER,
                ChainId.HARMONY, ChainId.XDAI, ChainId.OPTIMISM, ChainId.BSC
            ]
            const vaultInfoPromises = chainIds.flatMap((chainId) => {
                const contracts = Contracts[chainId];
                if (contracts)
                    return contracts.map(c => {
                        return {...c, chainId}
                    })
                else
                    return []
            }).flatMap(async (contractMeta) => {
                if (contractMeta){
                    try {
                        console.info(`Fetching: ${contractMeta.label} on ${contractMeta.chainId}`)
                        const vaults = await fetchVaultInfo(contractMeta.chainId, contractMeta.address, contractMeta.abi)
                        vaults.forEach(v => {
                            dataProvider.create('vaults', {data: v})
                        })
                        console.info(`Fetched: ${contractMeta.label} on ${contractMeta.chainId}`)

                    } catch (e: any) {
                        console.error(`Error fetching: ${contractMeta.label} on ${contractMeta.chainId}`)
                    }
                }
            })

            if (vaultInfoPromises) {
                await Promise.all(vaultInfoPromises)
                console.info("Finished")
            }
        }

        void effect()
    }, [dataProvider])

    return (
        <Admin dataProvider={dataProvider} theme={theme as RaThemeOptions}>
            <Resource name={'vaults'} list={VaultList}/>
        </Admin>
    );
}

const App = () => {

    return <DataDisplay/>;
};


export default App;