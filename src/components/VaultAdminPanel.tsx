import { TextField } from "@mui/material";
import {
  ChainId,
  COLLATERAL,
  COLLATERAL_V2,
  COLLATERALS,
  GAUGE_VALID_COLLATERAL,
  GAUGE_VALID_COLLATERAL_V2,
} from "@qidao/sdk";
import { BigNumber, ethers } from "ethers";
import React, { createContext, useContext, useState } from "react";
import { useChainId, useProvider } from "../Connectors/Metamask";
import { VaultContract } from "./types";

type VaultAdminVaultData = (
  | COLLATERAL
  | COLLATERAL_V2
  | GAUGE_VALID_COLLATERAL
  | GAUGE_VALID_COLLATERAL_V2
) & {
  depositedCollateralAmount: number;
  id: string | number;
  vaultIdx: number;
};

// async function generateVaultTx(
//   collateral: VaultAdminVaultData,
//   provider: Provider
// ): Promise<TxForTxBuilder[]> {
//   return [
//     {
//       description: `${collateral.token.name} zap from ${
//         ChainName[collateral.chainId]
//       }`,
//       raw: {
//         to: collateral.vaultAddress,
//         value: "0",
//         data: opTx.data || "",
//       },
//     },
//   ];
// }
interface VaultAdminContextInterface {
  burn: boolean;
  changeEthPriceSource?: string;
  setAdmin?: string;
  setDebtRatio?: BigNumber;
  setGainRatio?: BigNumber;
  setInterestRate?: BigNumber;
  setMaxDebt?: BigNumber;
  setMinDebt?: BigNumber;
  setRef?: string;
  setTokenURI?: string;
}

const VaultAdminContext = createContext<VaultAdminContextInterface>({
  burn: false,
});

const VaultAdminDispatchContext = createContext<
  | ((
      value:
        | ((
            prevState: VaultAdminContextInterface
          ) => VaultAdminContextInterface)
        | VaultAdminContextInterface
    ) => void)
  | null
>(null);

function useVaultAdminContext() {
  return useContext(VaultAdminContext);
}

function useVaultAdminDispatchContext() {
  return useContext(VaultAdminDispatchContext);
}
const NumericalField: React.FC<{
  vaultContract: VaultContract;
  label: string;
  vaultMethod: VaultAdminMethod;
  decimals: number;
}> = ({ vaultContract, label, vaultMethod, decimals }) => {
  const setFormState = useVaultAdminDispatchContext();
  const currentFormState = useVaultAdminContext();

  const [formField, setFormField] = useState("0");

  function modifyFormState(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    if (setFormState) {
      setFormState({
        ...currentFormState,
        [vaultMethod]: ethers.utils.parseUnits(e.target.value, decimals),
      });
    }
  }

  if (!(vaultMethod in vaultContract)) {
    return <></>;
  } else {
    // const tx = vaultContract.populateTransaction["setOpeningFee"]();
    return (
      <div>
        <TextField
          id="outlined-basic"
          label={label}
          value={formField}
          onChange={(e) => {
            setFormField(e.target.value);
            modifyFormState(e);
          }}
          variant="outlined"
          fullWidth
        />
      </div>
    );
  }
};

enum VaultAdminMethod {
  "changeEthPriceSource" = "changeEthPriceSource",
  "setGainRatio" = "setGainRatio",
  "setDebtRatio" = "setDebtRatio",
  "setOpeningFee" = "setOpeningFee",
  "setTokenURI" = "setTokenURI",
  "setMinDebt" = "setMinDebt",
  "setMaxDebt" = "setMaxDebt",
  "setRef" = "setRef",
  "setAdmin" = "setAdmin",
  "burn" = "burn",
  "setInterestRate" = "setInterestRate",
}

export default function VaultAdminPanel() {
  const metamaskProvider = useProvider();
  const chainId = useChainId() as ChainId;
  const collateral = COLLATERALS[chainId]?.[0];
  const [vaultAdminContextState, setVaultAdminContextState] =
    useState<VaultAdminContextInterface>({ burn: false });

  if (collateral && metamaskProvider) {
    const vaultContract = collateral.connect(
      collateral.vaultAddress,
      metamaskProvider
    );

    let adminFns = ["changeEthPriceSource"];

    if (VaultAdminMethod.setTokenURI in vaultContract) {
    }
    if ("setRef" in vaultContract) {
    }
    if ("setAdmin" in vaultContract) {
    }
    if ("burn" in vaultContract) {
    }
    return (
      <VaultAdminDispatchContext.Provider value={setVaultAdminContextState}>
        <VaultAdminContext.Provider value={vaultAdminContextState}>
          <div>
            <NumericalField
              vaultContract={vaultContract}
              label={"Gain Ratio"}
              vaultMethod={VaultAdminMethod.setGainRatio}
              decimals={2}
            />
            <NumericalField
              vaultContract={vaultContract}
              label={"Debt Ratio"}
              vaultMethod={VaultAdminMethod.setDebtRatio}
              decimals={2}
            />
            <NumericalField
              vaultContract={vaultContract}
              label={"Min Debt"}
              vaultMethod={VaultAdminMethod.setMinDebt}
              decimals={2}
            />
            <NumericalField
              vaultContract={vaultContract}
              label={"Max Debt"}
              vaultMethod={VaultAdminMethod.setMaxDebt}
              decimals={2}
            />
            <NumericalField
              vaultContract={vaultContract}
              label={"Interest Rate"}
              vaultMethod={VaultAdminMethod.setInterestRate}
              decimals={2}
            />
            <NumericalField
              vaultContract={vaultContract}
              label={"Opening Fee"}
              vaultMethod={VaultAdminMethod.setOpeningFee}
              decimals={2}
            />
            <NumericalField
              vaultContract={vaultContract}
              label={"Burn"}
              vaultMethod={VaultAdminMethod.burn}
              decimals={2}
            />
          </div>
        </VaultAdminContext.Provider>
      </VaultAdminDispatchContext.Provider>
    );
  }
  return <></>;
}
