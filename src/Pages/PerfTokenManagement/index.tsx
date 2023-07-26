import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { ChainId, PERF_TOKEN_ZAP_META, Token } from '@qidao/sdk'
import { Contract } from 'ethers'
import React from 'react'
import { useChainId, useProvider } from '../../Connectors/Metamask'
import { ChainName } from '../../constants'

const perfTokenAddresses: { [k in ChainId]?: string } = {
    [ChainId.MAINNET]: '0xEd8a2759B0f8ea0f33225C86cB726fa9C6E030A4',
    [ChainId.MATIC]: '0x232627F88a84A657b8A009AC17ffa226a34c9a87',
    [ChainId.OPTIMISM]: '0x954aC12C339C60EAFBB32213B15af3F7c7a0dEc2',
    [ChainId.ARBITRUM]: '0x580d0B0ed579c22635AdE9C91Bb7A1f0755F9C85',
}

const useTokenBalance = (perfTokenAddress: string, chainId: ChainId) => {
    const abi = ['function tokenBalances(address) view returns (uint256)']
    const [balance, setBalance] = React.useState<string | null>(null)
    const provider = useProvider(chainId)
    const address = perfTokenAddresses[chainId]
    React.useEffect(() => {
        if (!address || !provider) return

        const fetchBalance = async () => {
            const contract = new Contract(address, abi, provider)
            try {
                const balance = await contract.tokenBalances(perfTokenAddress)
                setBalance(balance?.toString())
            } catch (e) {
                console.error(e)
                setBalance('error')
            }
        }
        void fetchBalance()
    }, [address, provider, chainId])
    return balance
}

function TokenRow({ perfToken, chainId }: { perfToken: { address: string; symbol: string }; chainId: ChainId }) {
    const abi = ['function transferUnderlying(address) returns (uint256)', 'function withdrawFee(address) returns ()']
    const balance = useTokenBalance(perfToken.address, chainId)

    const provider = useProvider(chainId)
    const address = perfTokenAddresses[chainId]
    if (!address || !provider) return null

    const contract = new Contract(address, abi, provider.getSigner())
    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>{perfToken.symbol}</TableCell>
            <TableCell align="right">{balance}</TableCell>
            <TableCell align="center">
                <div className="flex w-full gap-2 items-center justify-around">
                    <Button
                        variant="contained"
                        onClick={() => {
                            contract.withdrawFee(perfToken.address)
                        }}
                    >
                        Withdraw Fee
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            contract.transferUnderlying(perfToken.address)
                        }}
                    >
                        Transfer Underlying
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}

function WithdrawPerfToken({ chainId }: { chainId: ChainId }) {
    const [selected, setSelected] = React.useState<string>('')
    const perfTokenManagerAddress = perfTokenAddresses[chainId]
    if (!perfTokenManagerAddress) return null

    const perfTokenMeta = PERF_TOKEN_ZAP_META[chainId]
    if (!perfTokenMeta) return null

    const perfTokens = Object.entries(perfTokenMeta).map(([vaultAddress, zapMeta]) => {
        let underlying: Token
        if ('underlying' in zapMeta) underlying = zapMeta.underlying
        else underlying = zapMeta.depositTokens[1]
        return { address: zapMeta.perfToken, symbol: underlying.symbol || '' }
    })

    return (
        <div>
            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Token</TableCell>
                                <TableCell align="right">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {perfTokens.map((t) => (
                                <TokenRow key={t.address} perfToken={t} chainId={chainId} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

export default function () {
    const chainId = useChainId() as ChainId
    if (!chainId) return null
    return (
        <div>
            <h1>Perf Token Management for {ChainName[chainId]}</h1>
            <WithdrawPerfToken chainId={(chainId || 1) as ChainId} />
        </div>
    )
}
