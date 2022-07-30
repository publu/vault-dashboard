import * as React from "react";
import { useRecordContext } from 'react-admin';

export const DeepLinkField = ({ source } : any) => {
    const record = useRecordContext();
    return record ? (
        <a href={record[source]} target="_blank" rel={"noreferrer"}>
            Vault Page
        </a>
    ) : null;
}

