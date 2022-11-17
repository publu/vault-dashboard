import React from "react";
import {
  Datagrid,
  ExportButton,
  FilterButton,
  List,
  NumberField,
  TextField,
  TopToolbar,
} from "react-admin";
import DashPagination from "./DashPagination";
import { DeepLinkField } from "./DeepLinkField";
import LoadingDisplay from "./LoadingDisplay";
import searchFilters from "./Search";

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

const VaultList: React.FC = () => {
  return (
    <List
      actions={<ListActions />}
      perPage={100}
      pagination={<DashPagination />}
      empty={<LoadingDisplay />}
      queryOptions={{ refetchInterval: 1000 }}
      filters={searchFilters}
    >
      <Datagrid>
        <TextField source="vaultChainName" />
        <TextField source="tokenName" />
        <NumberField source="vaultIdx" />
        <TextField source="owner" />
        <NumberField source="collateral" options={{ style: "decimal" }} />
        <NumberField
          source="debt"
          options={{ style: "currency", currency: "USD" }}
        />
        <NumberField source="cdr" options={{ style: "percent" }} />
        <NumberField source="risky" />
        <DeepLinkField source="vaultLink" />

        {/*<LiquidateButton/>*/}
      </Datagrid>
    </List>
  );
};

export default VaultList;
