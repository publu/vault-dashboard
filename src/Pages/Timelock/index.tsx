import LoadingButton from "@mui/lab/LoadingButton";
import { MenuItem, Select } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {
  ChainId,
  COLLATERALS,
  CrosschainQiStablecoin__factory,
} from "@qidao/sdk";
import { ethers } from "ethers";
import React, { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useProvider } from "../../Connectors/Metamask";
import { SimpleTimelock__factory } from "../../contracts";
import { saveTemplateAsJsonFile } from "../../utils/files";
import Field from "./Field";
import { AbiFragment, AbiFunctionName, ITimelockQueueTxForm } from "./types";
import VaultForm from "./VaultForm";

const abiCoder = ethers.utils.defaultAbiCoder;
const TIMELOCK_ADDRESS = "0x257FF75BEf85ca0C1517168Ef27EFc69e5c7016f";

// type foo = Erc20Stablecoin[""];
const contractAbi = CrosschainQiStablecoin__factory.createInterface();

const abi: AbiFragment[] = Object.entries(contractAbi.functions)
  .filter(([k, v]) => {
    return v.stateMutability === "nonpayable";
  })
  .map(([k, v]) => {
    return {
      name: v.name as AbiFunctionName,
      functionFragment: v,
      inputs: v.inputs,
    };
  });

function QueueForm() {
  const methods = useForm<ITimelockQueueTxForm>();
  const { handleSubmit, getValues } = methods;
  // const [isWaitingOnTx, setIsWaitingOnTx] = useState(false);
  const provider = useProvider();
  const onSubmit = async (formValues: ITimelockQueueTxForm) => {
    const abiIdx = getValues("selectedAbi");
    const abiFragment = abi[abiIdx];

    const { _target, _value, _timestamp } = formValues;

    const argsForFunctionCallFromForm = formValues[abiFragment.name];

    if (!provider || !argsForFunctionCallFromForm) return;

    const timelock = SimpleTimelock__factory.connect(
      TIMELOCK_ADDRESS,
      provider
    );
    const vaultAddress = COLLATERALS[ChainId.MATIC]?.find(
      (c) => c.shortName === "weth"
    )?.vaultAddress;
    if (!vaultAddress) return;

    const argTypes = abiFragment.inputs.map((i) => i.type);
    const argsInOrder = abiFragment.inputs.map((v) => {
      return argsForFunctionCallFromForm[v.name];
    });

    const encodedArgs = abiCoder.encode(argTypes, argsInOrder);
    const functionSig = abiFragment.functionFragment.format("sighash");
    const tx = await timelock.populateTransaction.queue(
      _target,
      _value,
      functionSig,
      encodedArgs,
      _timestamp
    );
    console.log({ tx, _target, _value, functionSig, encodedArgs, _timestamp });

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
    saveTemplateAsJsonFile("timelock.json", gnosisTx);
    // setIsWaitingOnTx(true);
    // await tx.wait(1);
    // setIsWaitingOnTx(false);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Field name="_target" />
          <Field name="_value" />
          <VaultForm abi={abi} />
          <Field name="_timestamp" />
        </div>
        <LoadingButton variant="outlined" type="submit">
          Submit
        </LoadingButton>
      </form>
    </FormProvider>
  );
}

interface ITimelockExecuteTxForm extends ITimelockQueueTxForm {
  payableAmount: string;
}

function ExecuteForm() {
  const methods = useFormContext<ITimelockExecuteTxForm>();
  const { handleSubmit, getValues } = methods;
  // const [isWaitingOnTx, setIsWaitingOnTx] = useState(false);
  const provider = useProvider();
  const onSubmit = async (formValues: ITimelockExecuteTxForm) => {
    const { _target, _value, _timestamp } = formValues;

    const abiIdx = getValues("selectedAbi");
    const abiFragment = abi[abiIdx];

    const argsForFunctionCallFromForm = formValues[abiFragment.name];

    if (!provider || !argsForFunctionCallFromForm) return;

    const timelock = SimpleTimelock__factory.connect(
      TIMELOCK_ADDRESS,
      provider
    );
    const vaultAddress = COLLATERALS[ChainId.MATIC]?.find(
      (c) => c.shortName === "weth"
    )?.vaultAddress;
    if (!vaultAddress) return;

    const argTypes = abiFragment.inputs.map((i) => i.type);
    const argsInOrder = abiFragment.inputs.map((v) => {
      return argsForFunctionCallFromForm[v.name];
    });

    const encodedArgs = abiCoder.encode(argTypes, argsInOrder);
    const functionSig = abiFragment.functionFragment.format("sighash");
    const tx = await timelock.populateTransaction.queue(
      _target,
      _value,
      functionSig,
      encodedArgs,
      _timestamp
    );
    console.log({ tx, _target, _value, functionSig, encodedArgs, _timestamp });

    const gnosisTx = [
      {
        description: `Timelock TX for ${abiFragment.name}`,
        raw: {
          to: TIMELOCK_ADDRESS,
          value: "0",
          data: tx.data || "",
        },
      },
    ];
    saveTemplateAsJsonFile("timelock.json", gnosisTx);
    // setIsWaitingOnTx(true);
    // await tx.wait(1);
    // setIsWaitingOnTx(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Field name="payableAmount" />
        <Field name="_target" />
        <Field name="_value" />
        <VaultForm abi={abi} />
        <Field name="_timestamp" />
      </div>
      <LoadingButton variant="outlined" type="submit">
        Submit!
      </LoadingButton>
    </form>
  );
}

const Timelock: React.FC = () => {
  const [selected, setSelected] = useState<"execute" | "queue">("queue");
  const methods = useForm<ITimelockExecuteTxForm>();
  const state = methods.watch();
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
            setSelected(v.target.value as "execute" | "queue");
          }}
        >
          <MenuItem value={"queue"}>Queue</MenuItem>
          <MenuItem value={"execute"}>Execute</MenuItem>
        </Select>
      </Grid>

      <FormProvider {...methods}>
        {selected === "queue" ? <QueueForm /> : <ExecuteForm />}
      </FormProvider>
      <pre>{JSON.stringify(methods.formState.errors, null, 2)}</pre>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </Grid>
  );
};

export default Timelock;
