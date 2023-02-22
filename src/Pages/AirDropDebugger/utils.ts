import { BigNumber, ethers } from 'ethers'

export const calcEarnedIncentivesDollars = (ownerDebt: BigNumber, aprBasisPoints: number) => {
    return ownerDebt
        .mul(aprBasisPoints)
        .div(10000)
        .div(365 * (24 / 3))
}

export interface OwnerDataByCollateralAndVaultUnparsed {
    [collateral: string]: {
        [owner: string]: {
            [vault: string]: {
                [blockNumber: string]: {
                    cdr: number
                    debt: {
                        type: 'BigNumber'
                        hex: `0x${string}`
                    }
                }
            }
        }
    }
}
export interface OwnerDataByCollateralAndVault {
    [collateral: string]: {
        [owner: string]: {
            [vault: string]: {
                [blockNumber: string]: { cdr: number; debtAtBlock: string; dollarsOfIncentivesEarned: string }
            }
        }
    }
}

export const scaryParseJsonFn = (json: OwnerDataByCollateralAndVaultUnparsed): OwnerDataByCollateralAndVault => {
    return Object.fromEntries(
        Object.entries(json).map(([collateral, ownerData]) => {
            return [
                collateral,
                Object.fromEntries(
                    Object.entries(ownerData).map(([owner, vaultData]) => {
                        return [
                            owner,
                            Object.fromEntries(
                                Object.entries(vaultData).map(([vault, blockData]) => {
                                    return [
                                        vault,
                                        Object.fromEntries(
                                            Object.entries(blockData).map(([blockNumber, debtAndCdr]) => {
                                                const { cdr, debt } = debtAndCdr
                                                let aprBasisPoints: number
                                                switch (collateral) {
                                                    case '0xa478E708A27853848C6Bc979668fe6225FEe46Fa':
                                                        aprBasisPoints = 1500
                                                        break
                                                    case '0x86f78d3cbCa0636817AD9e27a44996C738Ec4932':
                                                        aprBasisPoints = 500
                                                        break
                                                    case '0x9A05b116b56304F5f4B3F1D5DA4641bFfFfae6Ab':
                                                        aprBasisPoints = 300
                                                        break
                                                    default:
                                                        aprBasisPoints = 0
                                                }
                                                return [
                                                    blockNumber,
                                                    {
                                                        cdr,
                                                        debtAtBlock: ethers.utils.formatEther(BigNumber.from(debt.hex)),
                                                        dollarsOfIncentivesEarned: ethers.utils.formatEther(
                                                            calcEarnedIncentivesDollars(BigNumber.from(debt.hex), aprBasisPoints)
                                                        ),
                                                    },
                                                ]
                                                // return {
                                                //     collateral,
                                                //     // collateralName: Object.values(COLLATERALS).flat().find( x=> [collateral].name,
                                                //     owner,
                                                //     vault,
                                                //     blockNumber,
                                                //     amount: BigNumber.from(amount.hex),
                                                // }
                                            })
                                        ),
                                    ]
                                })
                            ),
                        ]
                    })
                ),
            ]
        })
    )
}
