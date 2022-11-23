import {
  ChainId,
  COLLATERAL,
  COLLATERAL_V2,
  COLLATERALS,
  GAUGE_VALID_COLLATERAL,
  GAUGE_VALID_COLLATERAL_V2,
} from "@qidao/sdk";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Contract } from "ethcall";
import fakeDataProvider from "ra-data-fakerest";
import React, {useLayoutEffect} from 'react';

import {
  Admin,
  CustomRoutes,
  DataProvider,
  NotificationType,
  Resource,
  useNotify,
} from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";
import Layout from "../components/Layout";
import { ChainName } from "../constants";
import { init } from "../multicall";
import { theme } from "../theme";
import { fetchVaultInfo } from "../vaultInfo";
import LiquidationHistory from "./LiquidationHistory";
import SnapshotProposal from "./SnapshotProposal";
import TreasuryAdmin from "./TreasuryAdmin";
import VaultAdminPanel from "./VaultAdminPanel";
import VaultList from "./VaultList";

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
        const qiDaoContracts = COLLATERALS[chainId]?.filter(
          (c) => !c.disabled && c.shortName !== "matic"
        );

        const contracts = [...(qiDaoContracts || [])];

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
            for (const v of vaults) {
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
                try {
                  await dataProvider.create("vaults", { data: v });
                } catch (e) {
                  if (v.vaultIdx === 0) {
                    await dataProvider.update("vaults", {
                      id: v.id,
                      data: v,
                      previousData: generateEmptyVault(v),
                    });
                  }
                  console.warn({ e });
                }
              }
            }
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

function generateEmptyVault(
  c:
    | COLLATERAL
    | COLLATERAL_V2
    | GAUGE_VALID_COLLATERAL
    | GAUGE_VALID_COLLATERAL_V2
) {
  const vaultChainName = ChainName[c.chainId];
  const vaultLink =
    "https://app.mai.finance/vaults/" +
    c.chainId.toString() +
    "/" +
    c.shortName +
    "/0";
  const contract = new Contract(c.vaultAddress, c.contractAbi);
  return {
    ...c,
    id: `${c.chainId}-${c.token.symbol}-${0}`,
    vaultIdx: 0,
    tokenName: c.token.name,
    owner: "",
    cdr: Infinity,
    collateral: 0,
    debt: 0,
    contract,
    chainId: c.chainId,
    vaultChainName,
    vaultLink,
    risky: false,
  };
}

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
      refetchOnMount: false,
      cacheTime: 1000 * 60 * 60 * 24,
    },
  },
});

const Routes: React.FC = () => {
  const dataProvider = fakeDataProvider({
    vaults: [],
  });
  const notify = useNotify();
  useLayoutEffect(
    () => fetchVaults(dataProvider, notify),
    [dataProvider, notify]
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <BrowserRouter>
        <Admin dataProvider={dataProvider} theme={theme} layout={Layout}>
          <Resource name={"vaults"} list={VaultList} />
          <CustomRoutes>
            <Route path="/treasury-admin" element={<TreasuryAdmin />} />
            <Route path="/snapshot-proposal" element={<SnapshotProposal />} />
            <Route
              path="/vault-admin-management"
              element={<VaultAdminPanel />}
            />
            <Route
              path="/liquidation-history"
              element={<LiquidationHistory />}
            />
          </CustomRoutes>
        </Admin>
      </BrowserRouter>
    </PersistQueryClientProvider>
  );
};

export default Routes;
