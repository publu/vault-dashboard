import { MetaTransactionData } from "@gnosis.pm/safe-core-sdk-types";
import * as MUI from "@mui/material";
import { Erc20Stablecoin } from "@qidao/sdk";
import React, { Dispatch, useEffect, useState } from "react";
import {
  Datagrid,
  ListContextProvider,
  TextField,
  TextFieldProps,
  useGetList,
  useList,
  useRecordContext,
} from "react-admin";
import { useChainId, useProvider } from "../Connectors/Metamask";
import { RAVaultInfoAnyVersion } from "../types";

// const safeAddress = "0x3182E6856c3B59C39114416075770Ec9DC9Ff436"; //ETH Address
// const transactionServiceUrl = "https://safe-transaction.gnosis.io/"; // on rinkeby testnet
// const chainId = 1;
// const safeAddress = "0xBdeEf118d161ac657AF5Abc2a26487DD894868c7"; //ETH Address
// const transactionServiceUrl = "https://safe-transaction.polygon.gnosis.io/"; // on rinkeby testnet
// const chainId = 137;

// const setupSafe = async (metamaskProvider: Web3Provider) => {
//   const ethAdapter = new EthersAdapter({
//     ethers,
//     signer: metamaskProvider.getSigner(),
//   });
//
//   console.log({ chainId: await ethAdapter.getChainId() });
//   const safeService = new SafeServiceClient({
//     ethAdapter,
//     txServiceUrl: transactionServiceUrl,
//   });
//   const safeSdk = await Safe.create({
//     ethAdapter,
//     safeAddress,
//     contractNetworks: {
//       "137": {
//         multiSendAddress: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
//         multiSendCallOnlyAddress: "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D",
//         safeMasterCopyAddress: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
//         safeProxyFactoryAddress: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
//       },
//     },
//   });
//   return { safeService, safeSdk };
// };

const saveTemplateAsFile = (filename: string, dataObjToWrite: Object) => {
  const blob = new Blob([JSON.stringify(dataObjToWrite)], {
    type: "text/json",
  });
  const link = document.createElement("a");

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove();
};

const EditiableRow = (
  props: TextFieldProps & {
    vaults: RAVaultInfoAnyVersion[];
    setVaults: Dispatch<
      React.SetStateAction<RAVaultInfoAnyVersion[] | undefined>
    >;
  }
) => {
  const [editMode, setEditMode] = useState(false);
  const foo: RAVaultInfoAnyVersion = useRecordContext(props);
  const [collateralValue, setCollateralValue] = useState(foo.collateral);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInt = parseFloat(event.target.value);
    const updatedVault = { ...foo, collateral: newInt ? newInt : 0 };
    const updatedVaults = props.vaults.map((v) =>
      v.id !== updatedVault.id ? v : updatedVault
    );
    console.log({ updatedVaults });
    props.setVaults(updatedVaults);
    setCollateralValue(newInt ? newInt : 0);
  };
  return (
    <>
      {editMode ? (
        <MUI.TextField
          value={collateralValue}
          size="small"
          onChange={handleChange}
          onBlur={() => setEditMode(!editMode)}
        />
      ) : (
        <TextField onClick={() => setEditMode(!editMode)} source="collateral" />
      )}
    </>
  );
};

const TreasuryAdmin = () => {
  const {
    data,
    isLoading,
  }: {
    data?: RAVaultInfoAnyVersion[];
    total?: number;
    isLoading?: boolean;
    pageInfo?: { hasNextPage?: boolean; hasPreviousPage?: boolean };
  } = useGetList("vaults", {
    filter: { vaultIdx: 0 },
    pagination: {
      page: 1,
      perPage: 5000,
    },
  });

  // const [safeSdk, setSafeSdk] = useState<Safe>();
  // const [safeService, setSafeService] = useState<SafeServiceClient>();
  let metamaskProvider = useProvider();
  const chainId = useChainId();
  const [vaults, setVaults] = useState(data);
  useEffect(() => {
    const a = async () => {
      if (metamaskProvider) {
        // const { safeService, safeSdk } = await setupSafe(metamaskProvider);
        // setSafeSdk(safeSdk);
        // setSafeService(safeService);
      }
    };
    void a();
  }, [metamaskProvider]);

  const a = async () => {
    const vaultWithdrawTxs:
      | Promise<(MetaTransactionData | undefined) | undefined>[]
      | undefined = vaults?.map(async (vault) => {
      if (vault && metamaskProvider) {
        const vaultContract = vault.connect(
          vault.vaultAddress,
          metamaskProvider
        );

        try {
          const collateralAmount = await vaultContract.vaultCollateral(
            vault.vaultIdx
          );
          const foo = await (
            vaultContract as Erc20Stablecoin
          ).populateTransaction.withdrawCollateral(
            vault.vaultIdx,
            collateralAmount
          );
          // const foo = vaultContract.populateTransaction.withdrawCollateral( );

          return {
            to: vault.vaultAddress,
            value: "0",
            data: foo.data || "",
          };
        } catch (e) {
          console.warn({ e });
          return;
        }
      } else return;
    });
    if (vaultWithdrawTxs) {
      const vaultTxs = (await Promise.all(vaultWithdrawTxs)).filter(
        (item): item is MetaTransactionData => !!item
      );
      // const safeTx = await safeSdk.createTransaction({
      //   safeTransactionData: vaultTxs,
      // });
      console.log({ vaultTxs });
      // console.log({ safeTx });
      saveTemplateAsFile(`${chainId}-withdraw-txes.json`, vaultTxs);
      // const safeTxHash = await safeSdk.getTransactionHash(safeTx);
      // const signature = await safeSdk.signTransactionHash(safeTxHash);
      // await safeService?.proposeTransaction({
      //   safeAddress: safeAddress,
      //   senderAddress: address || "",
      //   safeTransactionData: safeTx.data,
      //   senderSignature: signature.data,
      //   safeTxHash: safeTxHash,
      // });
    }
  };
  // }, [address, metamaskProvider, safeSdk, safeService, vaults]);
  const listContext = useList({ data: vaults || [] });
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <button onClick={() => a()}>Click me to sign</button>
          <ListContextProvider value={listContext}>
            <Datagrid>
              <TextField source="vaultIdx" />
              <TextField source="chainId" />
              <EditiableRow vaults={vaults || []} setVaults={setVaults} />
              <TextField source="token.name" />
            </Datagrid>
          </ListContextProvider>
        </>
      )}
    </div>
  );
};

export default TreasuryAdmin;
