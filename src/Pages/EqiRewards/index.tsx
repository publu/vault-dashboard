import LoadingButton from "@mui/lab/LoadingButton";
import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { ChainId } from "@qidao/sdk";
import { previousSunday } from "date-fns/fp";
import { BigNumber, ethers } from "ethers";
import React from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useBlockNumbersFromTS } from "../../utils/blockNumer";
import { RPC } from "../../utils/utils";
import { calculateRewards, generateDisperse } from "./eQiRewardFetcher";
import { generatePeriodTimestamps } from "./utils.date";

export interface IEqiRewardForm {
  snapshotBlock: string;
  minimumEndBlock: string;
  distributionAmount: string;
}

const FormField: React.FC<{ name: keyof IEqiRewardForm }> = (props) => {
  const { control } = useFormContext<IEqiRewardForm>();
  return (
    <Grid xs={12}>
      <Controller
        name={props.name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField {...field} variant="outlined" label={props.name} />
        )}
      />
    </Grid>
  );
};

const provider = new ethers.providers.JsonRpcProvider(RPC[ChainId.MATIC]);

const EqiRewards: React.FC = () => {
  const { startOfPreviousPeriod, startOfCurrentPeriod } =
    generatePeriodTimestamps(new Date());

  const threeWeekOldBlockNumber = useBlockNumbersFromTS(
    previousSunday(startOfPreviousPeriod),
    ChainId.MATIC
  )?.data?.blocks?.[0]?.number;

  const twoWeekOldBlockNumber = useBlockNumbersFromTS(
    startOfPreviousPeriod,
    ChainId.MATIC
  )?.data?.blocks?.[0]?.number;

  const weekOldBlockNumber = useBlockNumbersFromTS(
    startOfCurrentPeriod,
    ChainId.MATIC
  )?.data?.blocks?.[0]?.number;

  const methods = useForm<IEqiRewardForm>({
    defaultValues: {
      snapshotBlock: "0",
      minimumEndBlock: "0",
      distributionAmount: "0",
    },
  });

  const onSubmit = async ({
    distributionAmount,
    minimumEndBlock,
    snapshotBlock,
  }: IEqiRewardForm) => {
    const { userShare: rewards, shareSum } = await calculateRewards(
      BigNumber.from(snapshotBlock),
      BigNumber.from(minimumEndBlock),
      ethers.utils.parseEther(distributionAmount)
    );

    const minEndBlockTs = (await provider.getBlock(minimumEndBlock)).timestamp;
    const snapshotBlockTs = (await provider.getBlock(snapshotBlock)).timestamp;

    generateDisperse(
      Number(snapshotBlock),
      Number(minimumEndBlock),
      ethers.utils.parseEther(distributionAmount),
      shareSum,
      minEndBlockTs,
      snapshotBlockTs,
      rewards
    );
    // console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          container
        >
          <Grid display={"flex"} xs={12}>
            <Grid xs={5}>
              <Button
                variant="contained"
                onClick={() => {
                  methods.setValue("snapshotBlock", threeWeekOldBlockNumber);
                  methods.setValue("minimumEndBlock", twoWeekOldBlockNumber);
                }}
              >
                Week before Last
              </Button>
            </Grid>
            <Grid xs={5}>
              <Button
                variant="contained"
                onClick={() => {
                  methods.setValue("snapshotBlock", twoWeekOldBlockNumber);
                  methods.setValue("minimumEndBlock", weekOldBlockNumber);
                }}
              >
                Last Week
              </Button>
            </Grid>
          </Grid>
          <Grid xs={12}>
            <div>
              <h1>eQi Rewards Generator</h1>
            </div>
            <FormField name="snapshotBlock" />
            <FormField name="minimumEndBlock" />
            <FormField name="distributionAmount" />

            <LoadingButton variant="contained" type="submit">
              Submit
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};
export default EqiRewards;
