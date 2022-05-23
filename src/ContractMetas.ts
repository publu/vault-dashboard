import { JsonFragment } from '@ethersproject/abi'
import { ChainId, ChainIdKey } from './constants'
import {
    CrosschainNativeQiStablecoin__factory,
    CrosschainQiStablecoin__factory,
    CrosschainQiStablecoinSlim__factory,
    CrosschainQiStablecoinSlimV2__factory,
    CrosschainQiStablecoinV2__factory,
    CrosschainQiStablecoinwbtc__factory,
    Erc20QiStablecoin__factory
} from './contracts'

export interface ContractMeta {
    address: string
    abi: JsonFragment[]
    label: string
}
// TODO Fix error fetching MOVR on 1285, camWMATIC on 137. Fix intermittent double fetching vaults

export const Contracts: { [chainId in ChainIdKey]?: ContractMeta[] } = {
    [ChainId.MATIC]: [
        { label: 'AAVE', address: '0x87ee36f780ae843A78D5735867bc1c13792b7b11', abi: Erc20QiStablecoin__factory.abi },
        { label: 'BAL', address: '0x701A1824e5574B0b6b1c8dA808B184a7AB7A2867', abi: Erc20QiStablecoin__factory.abi },
        { label: 'CEL', address: '0x178f1c95c85fe7221c7a6a3d6f12b7da3253eeae', abi: Erc20QiStablecoin__factory.abi },
        { label: 'CRV', address: '0x98B5F32dd9670191568b661a3e847Ed764943875', abi: Erc20QiStablecoin__factory.abi },
        { label: 'FXS', address: '0xff2c44fb819757225a176e825255a01b3b8bb051', abi: CrosschainQiStablecoin__factory.abi },
        { label: 'GHST', address: '0xF086dEdf6a89e7B16145b03a6CB0C0a9979F1433', abi: Erc20QiStablecoin__factory.abi },
        { label: 'LINK', address: '0x61167073E31b1DAd85a3E531211c7B8F1E5cAE72', abi: Erc20QiStablecoin__factory.abi },
        { label: 'SAND', address: '0x305f113ff78255d4f8524c8f50c7300b91b10f6a', abi: Erc20QiStablecoin__factory.abi },
        { label: 'Stake DAO USD Strategy', address: '0x57cbf36788113237d64e46f25a88855c3dff1691', abi: Erc20QiStablecoin__factory.abi,},
        { label: 'WBTC', address: '0x37131aEDd3da288467B6EBe9A77C523A700E6Ca1', abi: Erc20QiStablecoin__factory.abi },
        { label: 'WETH', address: '0x3fd939B017b31eaADF9ae50C7fF7Fa5c0661d47C', abi: Erc20QiStablecoin__factory.abi },
        { label: 'WMATIC', address: '0x305f113ff78255d4f8524c8f50c7300b91b10f6a', abi: CrosschainQiStablecoinSlim__factory.abi },
        { label: 'camAAVE', address: '0x578375c3af7d61586c2C3A7BA87d2eEd640EFA40', abi: Erc20QiStablecoin__factory.abi },
        { label: 'camDAI', address: '0xD2FE44055b5C874feE029119f70336447c8e8827', abi: Erc20QiStablecoin__factory.abi },
        { label: 'camWBTC', address: '0x7dda5e1a389e0c1892caf55940f5fce6588a9ae0', abi: Erc20QiStablecoin__factory.abi },
        { label: 'camWETH', address: '0x11a33631a5b5349af3f165d2b7901a4d67e561ad', abi: Erc20QiStablecoin__factory.abi },
        { label: 'camWMATIC', address: '0x88d84a85A87ED12B8f098e8953B322fF789fCD1a', abi: Erc20QiStablecoin__factory.abi },
        { label: 'cxADA', address: '0x506533B9C16eE2472A6BF37cc320aE45a0a24F11', abi: Erc20QiStablecoin__factory.abi },
        { label: 'cxDOGE', address: '0x7CbF49E4214C7200AF986bc4aACF7bc79dd9C19a', abi: Erc20QiStablecoin__factory.abi },
        { label: 'cxWETH', address: '0x7d36999a69f2b99bf3fb98866cbbe47af43696c8', abi: Erc20QiStablecoin__factory.abi },
        { label: 'dQUICK', address: '0x649Aa6E6b6194250C077DF4fB37c23EE6c098513', abi: Erc20QiStablecoin__factory.abi },
        { label: 'vGHST', address: '0x1f0aa72b980d65518e88841ba1da075bd43fa933', abi: Erc20QiStablecoin__factory.abi },
    ],
    [ChainId.FANTOM]: [
        { label: 'WFTM', address: '0x1066b8FC999c1eE94241344818486D5f944331A0', abi: Erc20QiStablecoin__factory.abi },
        { label: 'WETH', address: '0xD939c268C49c442F037E968F045ba02f499562D4', abi: CrosschainQiStablecoin__factory.abi },
        { label: 'yvWFTM', address: '0x7efB260662a6FA95c1CE1092c53Ca23733202798', abi: CrosschainQiStablecoin__factory.abi },
        { label: 'yvDAI', address: '0x682E473FcA490B0adFA7EfE94083C1E63f28F034', abi: CrosschainQiStablecoin__factory.abi },
        { label: 'yvETH', address: '0x7aE52477783c4E3e5c1476Bbb29A8D029c920676', abi: Erc20QiStablecoin__factory.abi },
        { label: 'yvBTC', address: '0x571F42886C31f9b769ad243e81D06D0D144BE7B4', abi: Erc20QiStablecoin__factory.abi },
        { label: 'yvYFI', address: '0x6d6029557a06961aCC5F81e1ffF5A474C54e32Fd', abi: Erc20QiStablecoin__factory.abi },
        { label: 'BTC', address: '0xE5996a2cB60eA57F03bf332b5ADC517035d8d094', abi: CrosschainQiStablecoinwbtc__factory.abi },
        { label: 'LINK', address: '0xd6488d586E8Fcd53220e4804D767F19F5C846086', abi: CrosschainQiStablecoin__factory.abi },
        { label: 'SUSHI', address: '0x267bDD1C19C932CE03c7A62BBe5b95375F9160A6', abi: Erc20QiStablecoin__factory.abi },
        { label: 'AAVE', address: '0xdB09908b82499CAdb9E6108444D5042f81569bD9', abi: Erc20QiStablecoin__factory.abi },
        { label: 'mooScreamFTM', address: '0x3609A304c6A41d87E895b9c1fd18c02ba989Ba90', abi: CrosschainQiStablecoin__factory.abi },
        { label: 'mooScreamETH', address: '0xC1c7eF18ABC94013F6c58C6CdF9e829A48075b4e', abi: Erc20QiStablecoin__factory.abi },
        {label: 'mooScreamBTC', address: '0x5563Cc1ee23c4b17C861418cFF16641D46E12436', abi: Erc20QiStablecoin__factory.abi,},
        { label: 'mooScreamLINK', address: '0x8e5e4D08485673770Ab372c05f95081BE0636Fa2', abi: CrosschainQiStablecoin__factory.abi },
        { label: 'mooScreamDAI', address: '0xBf0ff8ac03f3E0DD7d8faA9b571ebA999a854146', abi: CrosschainQiStablecoin__factory.abi },
        { label: 'mooBooBTC-FTM', address: '0xf34e271312e41bbd7c451b76af2af8339d6f16ed', abi: Erc20QiStablecoin__factory.abi },
        { label: 'mooBooETH-FTM', address: '0x9ba01b1279b1f7152b42aca69faf756029a9abde', abi: Erc20QiStablecoin__factory.abi },
        { label: 'mooBIFI', address: '0x75d4ab6843593c111eeb02ff07055009c836a1ef', abi: CrosschainQiStablecoin__factory.abi },
    ],
    [ChainId.AVALANCHE]: [
        { label: 'mooAaveAVAX', address: '0xfA19c1d104F4AEfb8d5564f02B3AdCa1b515da58', abi: CrosschainQiStablecoin__factory.abi },
        { label: 'Stake DAO USD Strategy Vault', address: '0x13a7fe3ab741ea6301db8b164290be711f546a73', abi: CrosschainQiStablecoinV2__factory.abi },
        { label: 'WETH', address: '0xa9122dacf3fccf1aae6b8ddd1f75b6267e5cbbb8', abi: CrosschainQiStablecoinSlim__factory.abi },
        { label: 'WBTC', address: '0x1f8f7a1d38e41eaf0ed916def29bdd13f2a3f11a', abi: CrosschainQiStablecoinSlimV2__factory.abi },
        { label: 'WAVAX', address: '0x73a755378788a4542a780002a75a7bae7f558730', abi: CrosschainQiStablecoinSlim__factory.abi },
    ],
    [ChainId.ARBITRUM]: [
        { label: 'WETH', address: '0xC76a3cBefE490Ae4450B2fCC2c38666aA99f7aa0', abi: CrosschainQiStablecoinSlim__factory.abi },
        { label: 'WBTC', address: '0xB237f4264938f0903F5EC120BB1Aa4beE3562FfF', abi: CrosschainQiStablecoinSlimV2__factory.abi },
    ],
    [ChainId.MOONRIVER]: [
        { label: 'ETH', address: '0x4a0474E3262d4DB3306Cea4F207B5d66eC8E0AA9', abi: CrosschainQiStablecoin__factory.abi },
        { label: 'ETH-USDC LP', address: '0x97D811A7eb99Ef4Cb027ad59800cE27E68Ee1109', abi: CrosschainQiStablecoin__factory.abi },
        { label: 'MOVR', address: '0x5db6617ddf077d76cfd9d7fc0fa91aaabc3da683', abi: CrosschainNativeQiStablecoin__factory.abi },
    ],
    [ChainId.HARMONY]: [
        { label: 'WETH', address: '0x46469f995A5CB60708200C25EaD3cF1667Ed36d6', abi: CrosschainQiStablecoin__factory.abi }, //Guessed abi
        { label: 'ONE', address: '0x12FcB286D664F37981a42cbAce92eAf28d1dA94f', abi: CrosschainQiStablecoin__factory.abi }, //Guessed abi
        { label: 'WBTC', address: '0x9f4E3d01c634441F284beb92bBAEeb76133BbB28', abi: CrosschainQiStablecoin__factory.abi }, //Guessed abi
    ],
    [ChainId.XDAI]: [
        { label: 'WETH', address: '0x5c49b268c9841AFF1Cc3B0a418ff5c3442eE3F3b', abi: CrosschainQiStablecoin__factory.abi },
        { label: 'GNO', address: '0x014a177e9642d1b4e970418f894985dc1b85657f', abi: CrosschainQiStablecoin__factory.abi }, //Guess abi
    ],
    [ChainId.OPTIMISM]: [
        { label: 'WETH', address: '0x062016cd29fabb26c52bab646878987fc9b0bc55', abi: CrosschainQiStablecoinSlim__factory.abi },
        { label: 'WBTC', address: '0xb9c8f0d3254007ee4b98970b94544e473cd610ec', abi: CrosschainQiStablecoinSlimV2__factory.abi },
    ],
    [ChainId.BSC]: [
        { label: 'WBNB', address: '0xa56f9a54880afbc30cf29bb66d2d9adcdcaeadd6', abi: CrosschainQiStablecoinSlim__factory.abi },
        { label: 'CAKE', address: '0x014a177e9642d1b4e970418f894985dc1b85657f', abi: CrosschainQiStablecoinSlim__factory.abi },
    ]
}
