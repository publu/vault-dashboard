import { Web3Provider } from "@ethersproject/providers";
import Safe from "@gnosis.pm/safe-core-sdk";
import { MetaTransactionData } from "@gnosis.pm/safe-core-sdk-types";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import { ethers } from "ethers";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useGetList } from "react-admin";
import { useAccount, useProvider } from "../Connectors/Metamask";
import { RAVaultInfoAnyVersion } from "../types";

const safeAddress = "0x3182E6856c3B59C39114416075770Ec9DC9Ff436"; //ETH Address
const transactionServiceUrl = "https://safe-transaction.gnosis.io/"; // on rinkeby testnet

const setupSafe = async (metamaskProvider: Web3Provider) => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signer: metamaskProvider.getSigner(),
  });

  const safeService = new SafeServiceClient({
    ethAdapter,
    txServiceUrl: transactionServiceUrl,
  });
  const safeSdk = await Safe.create({ ethAdapter, safeAddress });
  return { safeService, safeSdk };
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
  let address = useAccount();

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
        } else return;
      });
      if (vaultWithdrawTxs) {
        const vaultTxs = (await Promise.all(vaultWithdrawTxs)).filter(
          (item): item is MetaTransactionData => !!item
        );
        const safeTx = await safeSdk.createTransaction({
          safeTransactionData: vaultTxs,
        });
        console.log({ safeTx });
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
