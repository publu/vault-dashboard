import Grid from "@mui/material/Unstable_Grid2";
import { ChainId, COLLATERALS } from "@qidao/sdk";
import { formatUnits } from "ethers/lib/utils";
import React, { useState } from "react";
import {
  Datagrid,
  FunctionField,
  ListContextProvider,
  NumberField,
  useList,
} from "react-admin";
import CollateralSelector from "../components/common/CollateralSelector";
import { useChainId } from "../Connectors/Metamask";
import { shortenAddress } from "../utils/addresses";
import {
  LiquidationLog,
  useLiquidationHistory,
} from "../utils/liquidationHistory";

export default function LiquidationHistory(): JSX.Element {
  const chainId = useChainId() as ChainId;
  const [collateral, setCollateral] = useState(COLLATERALS[chainId]?.[0]);
  const liq = useLiquidationHistory(collateral);
  const liquidationLogList = useList({
    data: liq,
  });

  if (!collateral) return <></>;
  console.log(liq);

  return (
    <Grid container spacing={2}>
      <Grid xs={4}>
        <CollateralSelector
          selectedCollateral={collateral}
          setSelectedCollateral={setCollateral}
        />
      </Grid>
      <Grid xs={8} />
      <Grid xs={12}>
        <ListContextProvider value={liquidationLogList}>
          <Datagrid>
            <NumberField label="Vault ID" source="args.vaultID" />
            <FunctionField
              label="Buyer"
              render={(record: LiquidationLog) => {
                return shortenAddress(record.args.buyer);
              }}
            />
            <FunctionField
              label="Closing Fee"
              render={(record: LiquidationLog) =>
                formatUnits(record.args.closingFee, "18")
              }
            />
            <FunctionField
              label="Collateral Liquidated"
              render={(record: LiquidationLog) =>
                formatUnits(
                  record.args.collateralLiquidated,
                  collateral?.token.decimals
                )
              }
            />
            <FunctionField
              label="Debt Repaid"
              render={(record: LiquidationLog) =>
                formatUnits(record.args.debtRepaid, "18")
              }
            />
            <FunctionField
              label="Owner"
              render={(record: LiquidationLog) => {
                return shortenAddress(record.args.owner);
              }}
            />
          </Datagrid>
        </ListContextProvider>
      </Grid>
    </Grid>
  );
}
