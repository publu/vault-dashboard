import { MetaTransactionData } from "@gnosis.pm/safe-core-sdk-types";
import {
  CrosschainNativeQiStablecoin,
  CrosschainQiStablecoin,
  CrosschainQiStablecoinSlim,
  CrosschainQiStablecoinSlimV2,
  CrosschainQiStablecoinV2,
  CrosschainQiStablecoinwbtc,
  Erc20QiStablecoincamwbtc,
  Erc20QiStablecoinwbtc,
  Erc20Stablecoin,
  QiStablecoin,
  StableQiVault,
} from "@qidao/sdk";

export type TxForTxBuilder = { description: string; raw: MetaTransactionData };

export type VaultContractV2 = StableQiVault;

export type VaultContractSlim =
  | CrosschainQiStablecoinSlim
  | CrosschainQiStablecoinSlimV2;

export type VaultContractV1 =
  | Erc20Stablecoin
  | Erc20QiStablecoinwbtc
  | Erc20QiStablecoincamwbtc
  | CrosschainQiStablecoin
  | CrosschainNativeQiStablecoin
  | CrosschainQiStablecoinV2
  | CrosschainQiStablecoinwbtc;

export type VaultContract =
  | QiStablecoin
  | VaultContractV1
  | VaultContractSlim
  | VaultContractV2;

export function isV2Contract(
  vaultContract: VaultContract
): vaultContract is VaultContractV2 {
  return (vaultContract as VaultContractV2).iR !== undefined;
}
export function isSlimContract(
  vaultContract: VaultContract
): vaultContract is VaultContractSlim {
  return (vaultContract as VaultContractSlim).minDebt !== undefined;
}
