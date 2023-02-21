import React from 'react'
import { Loading } from 'react-admin'

const LoadingDisplay: React.FC = () => {
    return (
        <div className={'flex justify-center'}>
            <Loading loadingPrimary="Fetching Vault Data" loadingSecondary="Dashboard will populate momentarily" />
        </div>
    )
}

export default LoadingDisplay
