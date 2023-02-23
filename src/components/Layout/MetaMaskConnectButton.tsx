import React, { useEffect } from 'react'
import { metaMask, useIsActive } from '../../Connectors/Metamask'

export const NetworkButton: React.FC<{ title: string }> = ({ title }) => {
    const active = useIsActive()

    useEffect(() => {
        void metaMask.connectEagerly()
    }, [])

    if (active) {
        return (
            <button onClick={() => metaMask.activate()} title={title}>
                CONNECTED
            </button>
        )
    }

    // console.log({ active, isActivating, provider, chainId });

    return (
        <button onClick={() => metaMask.activate()} title={title}>
            CONNECT TO METAMASK
        </button>
    )
}
