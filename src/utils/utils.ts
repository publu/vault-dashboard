import { Web3Provider } from '@ethersproject/providers'
import { ChainId, COLLATERAL, COLLATERAL_V2, GAUGE_VALID_COLLATERAL, GAUGE_VALID_COLLATERAL_V2 } from '@qidao/sdk'
import { BigNumberish, ethers } from 'ethers'

export const formatAmount = (amount: BigNumberish) => {
    let floatNumber = 18
    return Number.parseFloat(ethers.utils.formatUnits(amount, floatNumber)).toLocaleString()
}

export const RPC = {
    [ChainId.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
    [ChainId.MAINNET]: 'https://eth-mainnet.alchemyapi.io/v2/q1gSNoSMEzJms47Qn93f9-9Xg5clkmEC',
    [ChainId.KOVAN]: 'https://eth-kovan.alchemyapi.io/v2/6OVAa_B_rypWWl9HqtiYK26IRxXiYqER',
    [ChainId.FANTOM]: 'https://rpc.ftm.tools/',
    [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network/',
    [ChainId.MATIC]: 'https://rpc-mainnet.maticvigil.com/',
    [ChainId.MATIC_TESTNET]: 'https://rpc-mumbai.maticvigil.com/',
    [ChainId.XDAI]: 'https://rpc.gnosischain.com/',
    [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
    [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
    // []: 'https://rpc.testnet.moonbeam.network/',
    [ChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
    // []: 'https://api.avax-test.network/ext/bc/C/rpc',
    [ChainId.HECO]: 'https://http-mainnet.hecochain.com/',
    [ChainId.HECO_TESTNET]: 'https://http-testnet.hecochain.com/',
    [ChainId.HARMONY]: 'https://api.harmony.one/',
    // []: 'https://explorer.pops.one/',
    [ChainId.MOONRIVER]: 'https://rpc.moonriver.moonbeam.network/',
    [ChainId.CRONOS]: 'https://evm-cronos.crypto.org/',
    [ChainId.OPTIMISM]: 'https://mainnet.optimism.io/',
}

export const PARAMS: { [K in ChainId]?: any } = {
    [ChainId.MAINNET]: {
        chainId: '0x1',
        chainName: 'Ethereum',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: [RPC[ChainId.MAINNET]],
        blockExplorerUrls: ['https://etherscan.com'],
    },
    [ChainId.FANTOM]: {
        chainId: '0xfa',
        chainName: 'Fantom',
        nativeCurrency: {
            name: 'Fantom',
            symbol: 'FTM',
            decimals: 18,
        },
        rpcUrls: [RPC[ChainId.FANTOM]],
        blockExplorerUrls: ['https://ftmscan.com'],
    },
    [ChainId.BSC]: {
        chainId: '0x38',
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18,
        },
        rpcUrls: [RPC[ChainId.BSC]],
        blockExplorerUrls: ['https://bscscan.com'],
    },
    [ChainId.MATIC]: {
        chainId: '0x89',
        chainName: 'Matic',
        nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18,
        },
        rpcUrls: [RPC[ChainId.MATIC]],
        blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com'],
    },
    [ChainId.HECO]: {
        chainId: '0x80',
        chainName: 'Heco',
        nativeCurrency: {
            name: 'Heco Token',
            symbol: 'HT',
            decimals: 18,
        },
        rpcUrls: [RPC[ChainId.HECO]],
        blockExplorerUrls: ['https://hecoinfo.com'],
    },
    [ChainId.XDAI]: {
        chainId: '0x64',
        chainName: 'Gnosis Chain',
        nativeCurrency: {
            name: 'xDai Token',
            symbol: 'xDai',
            decimals: 18,
        },
        rpcUrls: [RPC[ChainId.XDAI]],
        blockExplorerUrls: ['https://blockscout.com/xdai/mainnet/'],
    },
    [ChainId.HARMONY]: {
        chainId: '0x63564C40',
        chainName: 'Harmony One',
        nativeCurrency: {
            name: 'Harmony',
            symbol: 'ONE',
            decimals: 18,
        },
        rpcUrls: [RPC[ChainId.HARMONY]],
        blockExplorerUrls: ['https://explorer.harmony.one/'],
    },
    [ChainId.AVALANCHE]: {
        chainId: '0xA86A',
        chainName: 'Avalanche',
        nativeCurrency: {
            name: 'Avalanche',
            symbol: 'AVAX',
            decimals: 18,
        },
        rpcUrls: [RPC[ChainId.AVALANCHE]],
        blockExplorerUrls: ['https://cchain.explorer.avax.network/'],
    },
    [ChainId.MOONRIVER]: {
        chainId: '0x505',
        chainName: 'Moonriver',
        nativeCurrency: {
            name: 'Moonriver',
            symbol: 'MOVR',
            decimals: 18,
        },
        rpcUrls: [RPC[ChainId.MOONRIVER]],
        blockExplorerUrls: ['https://blockscout.moonriver.moonbeam.network/'],
    },
    [ChainId.CRONOS]: {
        chainId: '0x19',
        chainName: 'Cronos',
        nativeCurrency: {
            name: 'Crypto.com Coin',
            symbol: 'CRO',
            decimals: 18,
        },
        rpcUrls: [RPC[ChainId.CRONOS]],
        blockExplorerUrls: ['https://cronos.crypto.org/explorer/'],
    },
    [ChainId.ARBITRUM]: {
        chainId: '0xA4B1',
        chainName: 'Arbitrum One',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: [RPC[ChainId.ARBITRUM]],
        blockExplorerUrls: ['https://arbiscan.io/'],
    },
    [ChainId.OPTIMISM]: {
        chainId: '0xA',
        chainName: 'Optimistic Ethereum',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: [RPC[ChainId.OPTIMISM]],
        blockExplorerUrls: ['https://optimistic.etherscan.io/'],
    },
}

export async function addOrSwapChain(activeLibrary: Web3Provider, account: string, cId: ChainId) {
    const params = PARAMS[cId]
    await activeLibrary?.send('wallet_addEthereumChain', [params, account])
}

export function getId(collateral: COLLATERAL | COLLATERAL_V2 | GAUGE_VALID_COLLATERAL | GAUGE_VALID_COLLATERAL_V2, vaultIdx: number) {
    return `${collateral.chainId}-${collateral.frontend}-${collateral.token.symbol}-${vaultIdx}`
}
