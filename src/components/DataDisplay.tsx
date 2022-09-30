import { ChainId, COLLATERALS } from "@qidao/sdk";
import React, { useLayoutEffect } from "react";
import fakeDataProvider from "ra-data-fakerest";
import { init } from "../multicall";
import { fetchVaultInfo } from "../vaultInfo";
import {
  Admin,
  DataProvider,
  NotificationType,
  Resource,
  useNotify,
  CustomRoutes,
} from "react-admin";
import { Route } from "react-router-dom";
import { theme } from "../theme";
import Layout from "./Layout";
import TreasuryAdmin from "./TreasuryAdmin";
import VaultList from "./VaultList";
import { BrowserRouter } from "react-router-dom";

let addedVaults = new Set();

const fetchVaults = (
  dataProvider: DataProvider,
  notify: (
    message: string,
    options?: NotificationOptions & { type?: NotificationType }
  ) => void
) => {
  const effect = async () => {
    await init();

    const chainIds = [
      ChainId.MAINNET,
      // ChainId.MATIC,
      // ChainId.FANTOM,
      // ChainId.AVALANCHE,
      // ChainId.ARBITRUM,
      // ChainId.MOONRIVER,
      // ChainId.HARMONY,
      // ChainId.XDAI,
      // ChainId.OPTIMISM,
      // ChainId.BSC,
      // ChainId.MOONBEAM,
      // ChainId.METIS,
    ];
    const vaultInfoPromises = chainIds
      .flatMap((chainId) => {
        const contracts = COLLATERALS[chainId]?.filter((c) => !c.disabled);
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
              `Error fetching: ${contractMeta.token.name} on ${contractMeta.chainId}`,
              e
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
};

const DataDisplay: React.FC = () => {
  const dataProvider = fakeDataProvider({
    vaults: [],
  });
  const notify = useNotify();
  useLayoutEffect(
    () => fetchVaults(dataProvider, notify),
    [dataProvider, notify]
  );

  return (
    <BrowserRouter>
      <Admin dataProvider={dataProvider} theme={theme} layout={Layout}>
        <Resource name={"vaults"} list={VaultList} />
        <CustomRoutes>
          <Route path="/treasury-admin" element={<TreasuryAdmin />} />
        </CustomRoutes>
      </Admin>
    </BrowserRouter>
  );
};

export default DataDisplay;
