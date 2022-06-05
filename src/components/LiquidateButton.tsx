import React from "react";
import {Button, useRecordContext} from "react-admin";

const LiquidateButton:React.FC = () => {
    const record = useRecordContext();

    return <Button
        label="Liquidate" onClick={() => {
        const vaultContract = record.contract
        const vaultId = record.vaultIdx
        console.log(vaultContract)
        console.log(vaultId)
        //Attempting to call liquidateVault results in a "liquidateVault is not a function error
        // vaultContract.liquidateVault(vaultId)
    }}
    />
}

export default LiquidateButton