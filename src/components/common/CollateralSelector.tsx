import * as MUI from "@mui/material";
import {
  ChainId,
  COLLATERAL,
  COLLATERAL_V2,
  COLLATERALS,
  GAUGE_VALID_COLLATERAL,
  GAUGE_VALID_COLLATERAL_V2,
} from "@qidao/sdk";
import React, { useEffect } from "react";
import { useChainId } from "../../Connectors/Metamask";

const CollateralSelector: React.FC<{
  selectedCollateral:
    | COLLATERAL
    | COLLATERAL_V2
    | GAUGE_VALID_COLLATERAL
    | GAUGE_VALID_COLLATERAL_V2;
  setSelectedCollateral: Function;
}> = ({ selectedCollateral, setSelectedCollateral }) => {
  const chainId = useChainId() as ChainId;

  useEffect(() => {
    setSelectedCollateral(COLLATERALS[chainId]?.[0]);
  }, [chainId, setSelectedCollateral]);

  if (!chainId) {
    return <></>;
  }
  const collateralsForChain = COLLATERALS[chainId] || [];
  return (
    <MUI.FormControl fullWidth>
      <MUI.InputLabel id="demo-simple-select-label">Collateral</MUI.InputLabel>
      <MUI.Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedCollateral.vaultAddress}
        label="Collateral"
        onChange={(e) => {
          const collateralVaultAddress = e.target.value;
          let newSelectedCollateral: COLLATERAL | COLLATERAL_V2 | undefined;
          collateralsForChain?.forEach((c) => {
            if (c.vaultAddress === collateralVaultAddress) {
              newSelectedCollateral = c;
            }
          });
          setSelectedCollateral(newSelectedCollateral);
        }}
      >
        {collateralsForChain.map((co) => {
          return (
            <MUI.MenuItem key={co.vaultAddress} value={co.vaultAddress}>
              {co.token.name}
            </MUI.MenuItem>
          );
        })}
      </MUI.Select>
    </MUI.FormControl>
  );
};

export default CollateralSelector;
