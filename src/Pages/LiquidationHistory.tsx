import Grid from "@mui/material/Unstable_Grid2";
import { COLLATERALS } from "@qidao/sdk";
import React from "react";
import {
  Datagrid,
  DateField,
  ListContextProvider,
  NumberField,
  TextField,
  useList,
} from "react-admin";
import { OnChainHexField } from "../components/common/OnChainHexField";
import { useLiquidationHistory } from "../utils/liquidationHistory";

export default function LiquidationHistory(): JSX.Element {
  const collaterals = Object.values(COLLATERALS).flat();
  console.log(collaterals);
  const liq = useLiquidationHistory(collaterals);
  const liquidationLogs = liq.flatMap(({ data }) => (data ? data : []));
  const liquidationLogList = useList({
    data: liquidationLogs,
  });

  console.log({ liquidationLogs });

  if (!collaterals) return <></>;
  return (
    <Grid container spacing={2}>
      <Grid xs={4}></Grid>
      <Grid xs={8} />
      <Grid xs={12}>
        <ListContextProvider value={liquidationLogList}>
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
        </ListContextProvider>
      </Grid>
    </Grid>
  );
}
