import * as React from "react";
import { useRecordContext } from 'react-admin';

interface DeepLinkFieldProps {
    source: string
}

export const DeepLinkField: React.FC<DeepLinkFieldProps> = ({ source } : DeepLinkFieldProps) => {
    const record = useRecordContext();
    return record ? (
        <a href={record[source]} target="_blank" rel={"noreferrer"}>
            Vault Page
        </a>
    ) : null;
}

