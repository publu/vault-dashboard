import React from 'react'
import { Datagrid, ExportButton, FilterButton, List, NumberField, Pagination, TextField, TopToolbar } from 'react-admin'
import { DeepLinkField } from './DeepLinkField'
import LoadingDisplay from './LoadingDisplay'
import searchFilters from './Search'

const ListActions = () => (
    <TopToolbar>
        <FilterButton />
        <ExportButton />
    </TopToolbar>
)

const VaultList: React.FC = () => {
    return (
        <List
            actions={<ListActions />}
            perPage={100}
            pagination={<Pagination rowsPerPageOptions={[25, 100, 200, 500]} />}
            empty={<LoadingDisplay />}
            queryOptions={{ refetchInterval: 1000 }}
            filters={searchFilters}
        >
            <Datagrid optimized>
                <TextField source="vaultChainName" />
                <TextField source="tokenName" />
                <NumberField source="vaultIdx" />
                <TextField source="owner" />
                <NumberField source="depositedCollateralAmount" options={{ style: 'decimal' }} />
                <NumberField source="debt" options={{ style: 'currency', currency: 'USD' }} />
                <NumberField source="cdr" options={{ style: 'percent' }} />
                <NumberField source="risky" />
                <DeepLinkField source="vaultLink" />

                {/*<LiquidateButton/>*/}
            </Datagrid>
        </List>
    )
}

export default VaultList
