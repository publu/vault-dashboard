import { Loading } from 'react-admin'
import React from "react";

const LoadingDisplay: React.FC = () => {
    return (<div className={"flex justify-center"}>
        <Loading loadingPrimary="Fetching Vault Data" loadingSecondary="Dashboard will populate momentarily"/>
    </div>)
}

export default LoadingDisplay