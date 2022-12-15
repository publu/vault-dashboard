import LoadingButton from "@mui/lab/LoadingButton";
import { Box, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
  ChainId,
  COLLATERALS,
  GAUGE_VALID_COLLATERAL,
  GAUGE_VALID_COLLATERAL_V2,
  isGaugeValid,
} from "@qidao/sdk";
import snapshot from "@snapshot-labs/snapshot.js";
import { addDays, getUnixTime } from "date-fns/fp"; // Grid version 2
import React, { useState } from "react";
import { useAccount, useChainId, useProvider } from "../../Connectors/Metamask";
import CheckboxList from "./CheckBoxList";

const hub = "https://hub.snapshot.org"; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);

export default function SnapshotProposal() {
  const [snapshotTitle, setSnapshotTitle] = React.useState(
    "QIP###: Vault Incentives Gauge (Round ##)"
  );

  const [snapshotProposalText, setSnapshotProposalText] = React.useState(
    `Vault incentives are allocated a total of 150k Qi per week. Following QIP047 & QIP162 the distribution of these rewards among vault types will be decided every two weeks by the DAO.

To vote, you must hold Qi. You can distribute your voting power among as many and as few collateral types as you wish. The aggregate distribution of responses will be used to calculate the final distribution of rewards.
### Quorum Standards:

Following QIP162, a minimum allocation of 7,500 QI per week (5% of the vote) is needed for a chain to receive rewards. If the collateral types for a chain collectively do not achieve a 7,500 QI per week allocation, then their rewards will be proportionally split among the other eligible collateral types.

Each vault type can get a maximum of 15% of the total incentives. Any extra percentage over 15% will be distributed among the other collaterals receiving votes in proportion to their vote share.

Vaults must have a minimum of 100 MAI debt to receive incentives unless the minimum borrow for a vault type is set higher.

Note: Qi holders will be able to vote from any chain that has QI.
`
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSnapshotProposalText(event.target.value);
  };
  const choices = Object.values(COLLATERALS).flat().filter(isGaugeValid);

  const [checked, setChecked] =
    useState<(GAUGE_VALID_COLLATERAL | GAUGE_VALID_COLLATERAL_V2)[]>(choices);
  const [startDateTime, setStartDateTime] = useState<Date | null>(new Date());
  const [endDateTime, setEndDateTime] = useState<Date | null>(
    addDays(3, new Date())
  );
  const [titleError, setTitleError] = useState(true);
  // const [startTimeError, setStartTimeError] = useState(false);
  // const [endTimeError, setEndTimeError] = useState(false);
  const [submissionMade, setSubmissionMade] = useState(false);
  let metamaskProvider = useProvider("any");
  let account = useAccount();
  const submitProposal = async () => {
    if (metamaskProvider && account && startDateTime && endDateTime) {
      const blockNumber = metamaskProvider.blockNumber;
      setSubmissionMade(true);
      try {
        const receipt = await client.proposal(metamaskProvider, account, {
          discussion: "https://discord.gg/qidaoprotocol",
          space: "qidao.eth",
          type: "weighted",
          title: snapshotTitle,
          body: snapshotProposalText,
          choices: checked.map((c) => c.snapshotName),
          start: getUnixTime(startDateTime),
          end: getUnixTime(endDateTime),
          snapshot: blockNumber,
          plugins: JSON.stringify({}),
          app: "snapshot",
        });
        console.log(`Successful Submission`, receipt);
      } catch (e: any) {
        console.warn(`Error in submission`, e);
      } finally {
        setSubmissionMade(false);
      }
    }
  };

  const chainId = useChainId();
  if (chainId && chainId !== ChainId.MATIC)
    return <div>Swap to Polygon, we need the correct block numbers</div>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={0} style={{ minHeight: "100%" }}>
        <Grid xs={4}>
          <CheckboxList
            choices={choices}
            checked={checked}
            setChecked={setChecked}
          />
        </Grid>
        <Grid container xs={8} style={{ maxHeight: "700px" }}>
          <Grid
            xs={9}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              error={titleError}
              id="outlined-basic"
              label="Proposal Title"
              value={snapshotTitle}
              onChange={(e) => {
                if (e.target.value.includes("#")) setTitleError(true);
                else setTitleError(false);
                setSnapshotTitle(e.target.value);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid
            xs={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <LoadingButton
              disabled={titleError || submissionMade}
              loading={submissionMade}
              variant="contained"
              onClick={submitProposal}
            >
              Submit
            </LoadingButton>
          </Grid>

          <Grid
            xs={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="Start Time"
              disablePast
              value={startDateTime}
              onChange={(newValue) => {
                setStartDateTime(newValue);
              }}
            />
          </Grid>

          <Grid
            xs={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="End Time"
              minDateTime={startDateTime}
              value={endDateTime}
              onChange={(newValue) => {
                setEndDateTime(newValue);
              }}
            />
          </Grid>
          <Grid xs={12}>
            <Box
              component="form"
              // sx={{
              //   "& .MuiTextField-root": { m: 1, width: "70ch" },
              // }}
              noValidate
              autoComplete="off"
            >
              <TextField
                fullWidth
                id="standard-multiline-flexible"
                label="Proposal Text"
                multiline
                value={snapshotProposalText}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
