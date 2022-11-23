import Grid from "@mui/material/Unstable_Grid2";
import { COLLATERALS } from "@qidao/sdk";
import Fuse from "fuse.js";
import { debounce } from "lodash";
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
  keys: [
    "chainId",
    "tokenName",
    "args.owner",
    "args.buyer",
    "args.collateralLiquidated",
    "args.closingFee",
    "args.debtRepaid",
  ],
};
export default function LiquidationHistory(): JSX.Element {
  const collaterals = Object.values(COLLATERALS).flat();
  const [filter, setFilter] = useState<string | null>(null);
  const liq = useLiquidationHistory(collaterals);
  const liquidationLogs = liq.flatMap(({ data }) => (data ? data : []));
  const fuse = new Fuse(liquidationLogs, fuseOptions);
  const filteredLiquidationLogs = !filter
    ? liquidationLogs
    : fuse.search(filter).map((r) => r.item);
  const liquidationLogList = useList({
    perPage: 25,
    data: filteredLiquidationLogs,
    // filterCallback: (record) => {
    //   if (!filter || filter === "") return true;
    //   const { owner, buyer, collateralLiquidated, closingFee, debtRepaid } =
    //     record.args;
    //
    //   const f = 1;
    //   return (
    //     record.tokenName.toLowerCase().includes(filter) ||
    //     owner.toLowerCase().includes(filter) ||
    //     buyer.toLowerCase().includes(filter) ||
    //     collateralLiquidated.toString().includes(filter) ||
    //     closingFee.toString().includes(filter) ||
    //     debtRepaid.toString().includes(filter)
    //   );
    // },
  });

  const filters = [<SearchInput source="q" size="small" alwaysOn name="q" />];
  const setFilters = debounce((filters: any) => setFilter(filters.q), 600);

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
