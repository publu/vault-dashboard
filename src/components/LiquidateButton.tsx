import React, {useState, useEffect} from "react";
import {Button, useRecordContext} from "react-admin";
import {useAccount, useChainId, useIsActive, useProvider} from "../Connectors/Metamask";
import {addOrSwapChain} from "../utils/utils";
import {ChainKey} from "../Connectors/Chains";
import {
    CrosschainQiStablecoin,
    CrosschainQiStablecoin__factory,
    QiStablecoin,
    QiStablecoin__factory
} from "../contracts";
import {ethers} from "ethers";
import {maiAddresses} from "../constants";

const LiquidateButton:React.FC = () => {
    const record = useRecordContext();
    let metaMaskIsActive = useIsActive()
    let chainId = useChainId()
    let metamaskProvider = useProvider()
    let account = useAccount()
    const vaultContract = record.contract;
    const vaultId = record.vaultIdx;
    const vaultChainId = record.chainId;
    const vaultChainName = record.vaultChainName;
    const vaultDebt = record.debt;
    const [buttonLabel, setButtonlabel] = useState("Approve Mai")

    useEffect(() => {
        const generateButtonLabel = async () => {
            if (account && metamaskProvider) {
                let maiContract = QiStablecoin__factory.connect(maiAddresses[vaultChainName], metamaskProvider)
                let allowance = await maiContract.allowance(account, vaultContract.address)
                if (allowance > vaultDebt) {
                    setButtonlabel("Liquidate")
                }
            }
        }
        generateButtonLabel()
    },)

    return <Button
        label={buttonLabel}
        onClick={ async () => {
            if (metaMaskIsActive && chainId && metamaskProvider && account) {
                if (account && !(chainId === vaultChainId)) {
                    await addOrSwapChain(metamaskProvider, account, vaultChainId as ChainKey)
                }
                console.log(maiAddresses[vaultChainName])
                console.log(vaultChainName)
                let maiContract = QiStablecoin__factory.connect(maiAddresses[vaultChainName], metamaskProvider)
                // let maiBalance = maiContract.balanceOf(account)
                let signerContract: QiStablecoin | CrosschainQiStablecoin = maiContract?.connect(metamaskProvider.getSigner())
                if(account && signerContract && (chainId === vaultChainId)) {
                    let allowance = await signerContract.allowance(account, vaultContract.address)
                    console.log(allowance)
                    console.log(vaultDebt)
                    if (allowance <= vaultDebt) {
                        console.log("approval call")
                        await signerContract.approve(vaultContract.address, ethers.constants.MaxUint256)
                    } else {
                        let stablecoin = CrosschainQiStablecoin__factory.connect(vaultContract.address, metamaskProvider)
                        signerContract = stablecoin?.connect(metamaskProvider.getSigner())
                        let tx = await signerContract.liquidateVault(vaultId)
                        await tx.wait(1)
                    }

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