import { RaRecord } from 'react-admin'
import { VaultInfo, VaultInfoV2 } from './vaultInfo'

export interface RAVaultInfo extends VaultInfo, RaRecord {}

export interface RAVaultInfoV2 extends VaultInfoV2, RaRecord {}

export type RAVaultInfoAnyVersion = RAVaultInfo | RAVaultInfoV2
