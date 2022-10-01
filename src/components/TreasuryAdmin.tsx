import { Web3Provider } from "@ethersproject/providers";
import Safe from "@gnosis.pm/safe-core-sdk";
import { MetaTransactionData } from "@gnosis.pm/safe-core-sdk-types";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import { ethers } from "ethers";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useGetList } from "react-admin";
import { useAccount, useChainId, useProvider } from "../Connectors/Metamask";
import { RAVaultInfoAnyVersion } from "../types";

// const safeAddress = "0x3182E6856c3B59C39114416075770Ec9DC9Ff436"; //ETH Address
// const transactionServiceUrl = "https://safe-transaction.gnosis.io/"; // on rinkeby testnet
// const chainId = 1;
const safeAddress = "0xBdeEf118d161ac657AF5Abc2a26487DD894868c7"; //ETH Address
const transactionServiceUrl = "https://safe-transaction.polygon.gnosis.io/"; // on rinkeby testnet
// const chainId = 137;

const setupSafe = async (metamaskProvider: Web3Provider) => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signer: metamaskProvider.getSigner(),
  });

  console.log({ chainId: await ethAdapter.getChainId() });
  const safeService = new SafeServiceClient({
    ethAdapter,
    txServiceUrl: transactionServiceUrl,
  });
  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress,
    contractNetworks: {
      "137": {
        multiSendAddress: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
        multiSendCallOnlyAddress: "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D",
        safeMasterCopyAddress: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
        safeProxyFactoryAddress: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
      },
    },
  });
  return { safeService, safeSdk };
};

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

  const [safeSdk, setSafeSdk] = useState<Safe>();
  const [safeService, setSafeService] = useState<SafeServiceClient>();
  let metamaskProvider = useProvider();
  const address = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    const a = async () => {
      if (metamaskProvider) {
        const { safeService, safeSdk } = await setupSafe(metamaskProvider);
        setSafeSdk(safeSdk);
        setSafeService(safeService);
      }
    };
    void a();
  }, [metamaskProvider]);

  const vaults = data?.map((x) => _.omit(x, ["contractAbi", "contract"]));
  const a = async () => {
    if (safeSdk) {
      const vaultWithdrawTxs:
        | Promise<(MetaTransactionData | undefined) | undefined>[]
        | undefined = vaults?.map(async (vault) => {
        if (vault) {
          const vaultContract = vault.connect(
            vault.vaultAddress,
            metamaskProvider
          );

          console.log({ vaultContract, idx: vault.vaultIdx });
          try {
            const collateralAmount = await vaultContract.vaultCollateral(
              vault.vaultIdx
            );
            const foo = vaultContract.populateTransaction.withdrawCollateral(
              vault.vaultIdx,
              collateralAmount
            );

            return {
              to: vault.vaultAddress,
              value: "0",
              data: (await foo).data,
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
        const safeTx = await safeSdk.createTransaction({
          safeTransactionData: vaultTxs,
        });
        console.log({ vaultTxs });
        console.log({ safeTx });
        saveTemplateAsFile(`${chainId}-withdraw-txes.json`, vaultTxs);
        const safeTxHash = await safeSdk.getTransactionHash(safeTx);
        const signature = await safeSdk.signTransactionHash(safeTxHash);
        await safeService?.proposeTransaction({
          safeAddress: safeAddress,
          senderAddress: address || "",
          safeTransactionData: safeTx.data,
          senderSignature: signature.data,
          safeTxHash: safeTxHash,
        });
      }
    }
  };
  // }, [address, metamaskProvider, safeSdk, safeService, vaults]);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <button onClick={() => a()}>Click me to sign</button>
      )}
    </div>
  );
};

export default TreasuryAdmin;
