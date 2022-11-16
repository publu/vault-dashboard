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
  StableQiVault,
} from "@qidao/sdk";

export type TxForTxBuilder = { description: string; raw: MetaTransactionData };

export type VaultContract =
  | Erc20Stablecoin
  | Erc20QiStablecoinwbtc
  | Erc20QiStablecoincamwbtc
  | StableQiVault
  | CrosschainQiStablecoin
  | CrosschainNativeQiStablecoin
  | CrosschainQiStablecoinV2
  | CrosschainQiStablecoinSlim
  | CrosschainQiStablecoinSlimV2
  | CrosschainQiStablecoinwbtc;
