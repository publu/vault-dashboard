import { MenuItem, Select } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Field from "../Field";
import { AbiFragment, ITimelockQueueTxForm } from "../types";

const FunctionForm = ({ func }: { func: AbiFragment }) => {
  if (!func) return <></>;
  else {
    return (
      <>
        {func.inputs.map((i: any) => {
          const functionName = func.name + "." + i.name;
          if (!func.name) return <></>;
          else
            return (
              <Field
                key={functionName}
                name={functionName}
                // name={v.name + i.name}
                label={i.name}
              />
            );
        })}
      </>
    );
  }
};

const VaultForm: React.FC<{ abi: AbiFragment[] }> = ({ abi }) => {
  const { control, watch } = useFormContext<ITimelockQueueTxForm>();
  // const [selected, setSelected] = useState(0);
  const selected = watch("selectedAbi");
  const func = abi?.[selected];

  return (
    <div>
      <Controller
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <Select
              {...field}
              variant="outlined"
              label={"Select ABI function"}
              value={selected}
              // onChange={(v) => {
              //   setSelected(Number(v.target.value));
              // }}
            >
              {abi?.map((func, i) => {
                return (
                  <MenuItem key={func.name} value={i}>
                    {func.name}
                  </MenuItem>
                );
              })}
            </Select>
          );
        }}
        name={"selectedAbi"}
        control={control}
      />
      <FunctionForm func={func} />
    </div>
  );
};
export default VaultForm;
