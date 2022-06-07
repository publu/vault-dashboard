import React from "react";
import {Button, useRecordContext} from "react-admin";
import {useAccount, useChainId, useIsActive, useProvider} from "../Connectors/Metamask";
import {addOrSwapChain} from "../utils/utils";
import {ChainKey} from "../Connectors/Chains";
import {CrosschainQiStablecoin__factory} from "../contracts";

const LiquidateButton:React.FC = () => {
    const record = useRecordContext();
    let metaMaskIsActive = useIsActive()
    let chainId = useChainId()
    let metamaskProvider = useProvider()
    let account = useAccount()

    return <Button
        label="Liquidate"
        onClick={ async () => {
        const vaultContract = record.contract;
        const vaultId = record.vaultIdx;
        const vaultChainId = record.chainId;
            if (metaMaskIsActive && chainId && metamaskProvider) {
                if (account && !(chainId === vaultChainId)) {
                    await addOrSwapChain(metamaskProvider, account, vaultChainId as ChainKey)
                }
                let stablecoin = CrosschainQiStablecoin__factory.connect(vaultContract.address, metamaskProvider)
                let signerContract = stablecoin?.connect(metamaskProvider.getSigner())
                if(signerContract && chainId === vaultChainId) {
                    const tx = await signerContract.liquidateVault(vaultId)
                    await tx.wait(1)
                } else {
                    alert("Make sure you're on the right chain and try again.")
                }
            } else {
                alert("Cannot connect to network")
            }
    }}
    />
}

export default LiquidateButton