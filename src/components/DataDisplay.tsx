import { ChainId, COLLATERALS } from "@qidao/sdk";
import React, { useLayoutEffect } from "react";
import fakeDataProvider from "ra-data-fakerest";
import { init } from "../multicall";
import { fetchVaultInfo } from "../vaultInfo";
import { Admin, Resource, useNotify } from "react-admin";
import { theme } from "../theme";
import VaultList from "./VaultList";
import { BrowserRouter } from "react-router-dom";

let addedVaults = new Set();

const DataDisplay: React.FC = () => {
  const dataProvider = fakeDataProvider({
    vaults: [],
    vaultsForCollection: [],
  });
  const notify = useNotify();
  useLayoutEffect(() => {
    const effect = async () => {
      await init();

      const chainIds = [
        ChainId.MAINNET,
        ChainId.MATIC,
        ChainId.FANTOM,
        ChainId.AVALANCHE,
        ChainId.ARBITRUM,
        ChainId.MOONRIVER,
        ChainId.HARMONY,
        ChainId.XDAI,
        ChainId.OPTIMISM,
        ChainId.BSC,
        ChainId.MOONBEAM,
        ChainId.METIS,
      ];
      const vaultInfoPromises = chainIds
        .flatMap((chainId) => {
          const contracts = COLLATERALS[chainId]?.filter(c => !c.disabled);
          if (contracts)
            return contracts.map((c) => {
              return { ...c };
            });
          else return [];
        })
        .flatMap(async (contractMeta) => {
          if (contractMeta) {
            try {
              console.info(
                `Fetching: ${contractMeta.shortName} on ${contractMeta.chainId}`
              );
              const vaults = await fetchVaultInfo(contractMeta);
              vaults.forEach((v) => {
                if (
                  addedVaults.has(
                    JSON.stringify(v, [
                      "vaultIdx",
                      "collateral",
                      "debt",
                      "owner",
                      "tokenName",
                      "risky",
                    ])
                  )
                ) {
                  console.log("duplicate vault");
                } else {
                  addedVaults.add(
                    JSON.stringify(v, [
                      "vaultIdx",
                      "collateral",
                      "debt",
                      "owner",
                      "tokenName",
                      "risky",
                    ])
                  );
                  dataProvider.create("vaults", { data: v });
                }
              });
              notify(
                `Fetched: ${contractMeta.token.name} on ${contractMeta.chainId}`
              );
              console.info(
                `Fetched: ${contractMeta.token.name} on ${contractMeta.chainId}`
              );
            } catch (e: any) {
              console.error(
                `Error fetching: ${contractMeta.token.name} on ${contractMeta.chainId}`, e
              );
              notify(
                `Error fetching: ${contractMeta.token.name} on ${contractMeta.chainId}`
              );
            }
          }
        });

      if (vaultInfoPromises) {
        await Promise.all(vaultInfoPromises);
        console.info("Finished");
      }
    };

    void effect();
  }, [dataProvider, notify]);

  return (
    <BrowserRouter>
      <Admin dataProvider={dataProvider} theme={theme}>
        <Resource name={"vaults"} list={VaultList} />
        {/*<Resource name={"vaultsForCollection"} list={VaultList} />*/}
      </Admin>
    </BrowserRouter>
  );
};

export default DataDisplay;
