import { BigNumberish } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

export function bigNumberToFloat(bn: BigNumberish, units = 18): number {
    return parseFloat(formatUnits(bn, units))
}
