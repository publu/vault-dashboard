import Grid from "@mui/material/Unstable_Grid2";
import { COLLATERALS } from "@qidao/sdk";
import Fuse from "fuse.js";
import React, { useState } from "react";
import {
  Datagrid,
  DateField,
  FilterForm,
  ListContextProvider,
  NumberField,
  Pagination,
  SearchInput,
  TextField,
  useList,
} from "react-admin";
import { OnChainHexField } from "../components/common/OnChainHexField";
import { useLiquidationHistory } from "../utils/liquidationHistory";

const fuseOptions = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ["chainId", "tokenName"],
};
export default function LiquidationHistory(): JSX.Element {
  const collaterals = Object.values(COLLATERALS).flat();
  const [filter, setFilter] = useState("");
  const liq = useLiquidationHistory(collaterals);
  const liquidationLogs = liq.flatMap(({ data }) => (data ? data : []));
  const fuse = new Fuse(liquidationLogs, fuseOptions);
  const logsAfterSearch = new Set(
    fuse.search(filter).map((res) => res.item.id)
  );
  const liquidationLogList = useList({
    perPage: 25,
    data: liquidationLogs,
    filterCallback: (record) => {
      if (!filter || filter === "") return true;
      return logsAfterSearch.has(record.id);
    },
  });

  const filters = [<SearchInput source="q" size="small" alwaysOn name="q" />];
  const setFilters = (filters: any) => {
    console.log({ filters });
    setFilter(filters.q);
  };

  if (!collaterals) return <></>;
  return (
    <ListContextProvider
      value={{ ...liquidationLogList, setFilters, filterValues: { q: filter } }}
    >
      <Grid container spacing={2}>
        <Grid xs={12}>
          <FilterForm filters={filters} />
        </Grid>
        <Grid xs={12}>
          <Datagrid optimized>
            <NumberField label="ChainId" source="chainId" />
            <NumberField label="Vault ID" source="args.vaultID" />
            <TextField label="Token" source="tokenName" />
            <OnChainHexField
              label="Owner"
              source="args.owner"
              addressType="address"
            />
            <OnChainHexField
              label="Buyer"
              source="args.buyer"
              addressType="address"
            />
            <NumberField label="Closing Fee" source="args.closingFee" />
            <NumberField
              label="Collateral Liquidated"
              source="args.collateralLiquidated"
            />
            <NumberField label="Debt Repaid" source="args.debtRepaid" />
            <DateField label="Tx Timestamp" source="timestamp" />
            <OnChainHexField
              label="TX"
              source="transactionHash"
              addressType="transaction"
            />
          </Datagrid>
          <Pagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            defaultValue={50}
          />
        </Grid>
      </Grid>
    </ListContextProvider>
  );
}
