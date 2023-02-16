import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { saveTemplateAsFile } from "../../utils/files";

// const SUBGRAPH = "https://api.thegraph.com/subgraphs/name/publu/eqi-stuff";
const SUBGRAPH =
  "https://api.thegraph.com/subgraphs/name/christianholman/eqi-subgraph";

export async function calculateRewards(
  snapshotBlock: BigNumber,
  minimumEndBlock: BigNumber,
  distributionAmount: BigNumber
) {
  let first = 1000;
  let skip = 0;

  let eligibleAccounts: any[] = [];

  const getBlockData = async () => {
    const query = `
            {
                accounts (
                    first: ${first}
                    skip: ${skip}
                    block: { number: ${snapshotBlock} }
                    where: {
                        endBlock_gte: ${parseInt(minimumEndBlock.toString())}
                    }
                ) {
                    id
                    amount
                    endBlock
                    blockNumber
                    balance
                    rateOfDecay
                }
            }
            `;

    let result = await fetch(SUBGRAPH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: query }),
    }).then(async (r) => {
      return r.json();
    });

    if (result && result.data && result.data.accounts) {
      eligibleAccounts.push(...result.data.accounts);
      if (result.data.accounts.length === first) {
        skip += first;
        await getBlockData();
      }
    }
  };

  await getBlockData();

  let eqiBalances = [];

  for (let i = 0; i < eligibleAccounts.length; i++) {
    const account = eligibleAccounts[i];
    const eventBalance = BigNumber.from(account.balance);
    const blockDifference = BigNumber.from(snapshotBlock).sub(
      BigNumber.from(account.blockNumber)
    );
    const balance = eventBalance.sub(
      blockDifference.mul(BigNumber.from(account.rateOfDecay))
    );
    const newEqiBalance = {
      account,
      balance: balance.toString(),
    };
    eqiBalances.push(newEqiBalance);
  }

  let shareSum: BigNumber = eqiBalances.reduce(
    (a, b) => a.add(BigNumber.from(b.balance)),
    BigNumber.from("0")
  );

  let userShare: any[] = [];

  for (let i = 0; i < eqiBalances.length; i++) {
    const element = eqiBalances[i];
    userShare.push({
      account: element.account.id,
      amount: distributionAmount.mul(element.balance).div(shareSum),
    });
  }

  return {
    userShare,
    shareSum,
  };
}

export function generateDisperse(
  SNAPSHOT_BLOCK: number,
  MINIMUM_END_BLOCK: number,
  DISTRIBUTION_AMOUNT: BigNumber,
  shareSum: BigNumber,
  snapshotTS: number,
  minimumEndTS: number,
  rewards: any[]
) {
  let formattedRewards: any = {
    details: {},
    values: {},
  };

  formattedRewards["details"] = {
    snapshotBlock: SNAPSHOT_BLOCK,
    minimumEndBlock: MINIMUM_END_BLOCK,
    distributionAmount: parseInt(DISTRIBUTION_AMOUNT.toString()) / 10 ** 18,
    eqiTotalSupply: parseInt(shareSum.toString()) / 10 ** 18,
    snapshotBlockTimeStamp: snapshotTS,
    minimumEndBlockTimeStamp: minimumEndTS,
  };

  const outputPath = `eqi-rewards-${SNAPSHOT_BLOCK}-${MINIMUM_END_BLOCK}.json`;
  const gnosisOutputPath = `eqi-rewards-${SNAPSHOT_BLOCK}-${MINIMUM_END_BLOCK}.csv`;
  const gnosisOutputLines: string[] = [];

  rewards.forEach((r) => {
    if (r.amount.gt(0)) {
      formattedRewards["values"][r.account] = formatUnits(r.amount.toString());
      gnosisOutputLines.push(
        `erc20,0x580A84C73811E1839F75d86d75d88cCa0c241fF4,${
          r.account
        },${formatUnits(r.amount.toString())}`
      );
    }
  });

  saveTemplateAsFile(outputPath, formattedRewards);
  saveTemplateAsFile(gnosisOutputPath, gnosisOutputLines);
}
