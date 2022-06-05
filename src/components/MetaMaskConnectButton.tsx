import React, { useEffect } from "react"
import { metaMask, useIsActive, useProvider, useChainId, useIsActivating} from "../Connectors/Metamask"

export const NetworkButton : React.FC<{title:string}> = ({title})=> {
    
    const active = useIsActive()
    const isActivating = useIsActivating()
    const provider = useProvider()
    const chainId = useChainId()

    useEffect(() => {
        metaMask.connectEagerly()
    }, [])

    if (active) {
        return (<button onClick={() => metaMask.activate()} title={title}>
       CONNECTED</button>)
    }

    console.log({active, isActivating, provider, chainId})

    return (<button onClick={() => metaMask.activate()} title={title}>
        CONNECT TO METAMASK</button>)
    
}