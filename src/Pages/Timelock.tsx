import LoadingButton from "@mui/lab/LoadingButton";
import { MenuItem, Select, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import { useProvider } from "../Connectors/Metamask";
import { SimpleTimelock__factory } from "../contracts";
import { saveTemplateAsFile } from "../utils/files";

const TIMELOCK_ADDRESS = "0x257FF75BEf85ca0C1517168Ef27EFc69e5c7016f";
interface ITimelockQueueTxForm {
  _target: string;
  _value: string;
  _func: string;
  _data: string;
  _timestamp: string;
}
interface IFieldProps<T extends FieldValues> {
  name: Path<T>;
  errors: FieldErrors<T>;
  control: Control<T>;
}

function Field<T extends FieldValues>(props: IFieldProps<T>) {
  const { name, control, errors } = props;
  return (
    <Grid xs={12}>
      <Controller
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <TextField
              {...field}
              fullWidth
              label={name.toString()}
              error={!!errors[name]}
              helperText={!errors[name] ? "" : `${errors[name]} is required`}
              variant={"outlined"}
            />
          );
        }}
        name={name}
        control={control}
      />
    </Grid>
  );
}
function QueueForm() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ITimelockQueueTxForm>();
  const [isWaitingOnTx, setIsWaitingOnTx] = useState(false);
  const provider = useProvider();
  const onSubmit = async (foo: ITimelockQueueTxForm) => {
    const { _target, _value, _func, _data, _timestamp } = foo;
    if (!provider) return;

    const timelock = SimpleTimelock__factory.connect(
      TIMELOCK_ADDRESS,
      provider
    );

    const tx = await timelock.populateTransaction.queue(
      _target,
      _value,
      _func,
      _data,
      _timestamp
    );
    const gnosisTx = [
      {
        description: `Timelock TX`,
        raw: {
          to: TIMELOCK_ADDRESS,
          value: "0",
          data: tx.data || "",
        },
      },
    ];
    saveTemplateAsFile("timelock.json", gnosisTx);
    // setIsWaitingOnTx(true);
    // await tx.wait(1);
    // setIsWaitingOnTx(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Field name="_target" errors={errors} control={control} />
        <Field name="_value" errors={errors} control={control} />
        <Field name="_func" errors={errors} control={control} />
        <Field name="_data" errors={errors} control={control} />
        <Field name="_timestamp" errors={errors} control={control} />
      </div>
      <LoadingButton loading={isWaitingOnTx} variant="outlined" type="submit">
        Submit
      </LoadingButton>
    </form>
  );
}

interface ITimelocExecuteTxForm extends ITimelockQueueTxForm {
  payableAmount: string;
}

function ExecuteForm() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ITimelocExecuteTxForm>();
  const [isWaitingOnTx, setIsWaitingOnTx] = useState(false);
  const provider = useProvider();
  const onSubmit = async (foo: ITimelocExecuteTxForm) => {
    const { _target, _value, _func, _data, _timestamp } = foo;
    if (!provider) return;

    const timelock = SimpleTimelock__factory.connect(
      TIMELOCK_ADDRESS,
      provider
    );

    const tx = await timelock.execute(
      _target,
      _value,
      _func,
      _data,
      _timestamp,
      {
        value: foo.payableAmount,
      }
    );

    const gnosisTx = [
      {
        description: `Timelock TX`,
        raw: {
          to: TIMELOCK_ADDRESS,
          value: "0",
          data: tx.data || "",
        },
      },
    ];
    saveTemplateAsFile("timelock.json", gnosisTx);
    // setIsWaitingOnTx(true);
    // await tx.wait(1);
    // setIsWaitingOnTx(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Field name="payableAmount" errors={errors} control={control} />
        <Field name="_target" errors={errors} control={control} />
        <Field name="_value" errors={errors} control={control} />
        <Field name="_func" errors={errors} control={control} />
        <Field name="_data" errors={errors} control={control} />
        <Field name="_timestamp" errors={errors} control={control} />
      </div>
      <LoadingButton loading={isWaitingOnTx} variant="outlined" type="submit">
        Submit
      </LoadingButton>
    </form>
  );
}

const Timelock: React.FC = () => {
  const [selected, setSelected] = useState("queue");
  return (
    <Grid container>
      <Grid xs={12}>
        <div>
          <h1>Timelock</h1>
        </div>
      </Grid>
      <Grid xs={12}>
        <Select
          variant="outlined"
          label={"Execute or Queue?"}
          value={selected}
          onChange={(v) => {
            setSelected(v.target.value);
          }}
        >
          <MenuItem value={"queue"}>Queue</MenuItem>
          <MenuItem value={"execute"}>Execute</MenuItem>
        </Select>
      </Grid>
      {selected === "queue" ? <QueueForm /> : <ExecuteForm />}
    </Grid>
  );
};

export default Timelock;
