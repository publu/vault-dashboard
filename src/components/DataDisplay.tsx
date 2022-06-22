import React, {useLayoutEffect} from "react";
import fakeDataProvider from "ra-data-fakerest";
import {init} from "../multicall";
import {ChainId} from "../constants";
import {Contracts} from "../ContractMetas";
import {fetchVaultInfo} from "../vaultInfo";
import {Admin, Resource, useNotify } from "react-admin";
import {theme} from "../theme";
import VaultList from "./VaultList";

let addedVaults = new Set()

const DataDisplay: React.FC = () => {
    const dataProvider = fakeDataProvider({vaults:[]});
    const notify = useNotify()
    useLayoutEffect(() => {
        const effect = async () => {
            await init()

            const chainIds = [
                ChainId.MATIC, ChainId.FANTOM,
                ChainId.AVALANCHE, ChainId.ARBITRUM, ChainId.MOONRIVER,
                ChainId.HARMONY, ChainId.XDAI, ChainId.OPTIMISM, ChainId.BSC, ChainId.MOONBEAM
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
                        const vaults = await fetchVaultInfo(contractMeta.chainId, contractMeta.address, contractMeta.abi, contractMeta.decimals, contractMeta.factory)
                        vaults.forEach(v => {
                            if (addedVaults.has(JSON.stringify(v, ['vaultIdx', 'collateral', 'debt', 'owner', 'tokenName']))){
                                console.log("duplicate vault")
                            } else {
                                addedVaults.add(JSON.stringify(v, ['vaultIdx', 'collateral', 'debt', 'owner', 'tokenName']))
                                dataProvider.create('vaults', {data: v})
                            }

                        })
                        notify(`Fetched: ${contractMeta.label} on ${contractMeta.chainId}`)
                        console.info(`Fetched: ${contractMeta.label} on ${contractMeta.chainId}`)

                    } catch (e: any) {
                        console.error(`Error fetching: ${contractMeta.label} on ${contractMeta.chainId}`)
                        notify(`Error fetching: ${contractMeta.label} on ${contractMeta.chainId}`)
                    }
                }
            })

            if (vaultInfoPromises) {
                await Promise.all(vaultInfoPromises)
                console.info("Finished")
            }
        }

        void effect()

    }, [dataProvider, notify])

    return (
        <Admin dataProvider={dataProvider} theme={theme}>
            <Resource name={'vaults'} list={VaultList}/>
        </Admin>
    );
}

export default DataDisplay