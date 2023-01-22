import { FunctionFragment } from "@ethersproject/abi";
import { CrosschainQiStablecoin } from "@qidao/sdk/dist/src/contracts/CrosschainQiStablecoin";
import { ParamType } from "ethers/lib/utils";

export type AbiFunctionName = keyof CrosschainQiStablecoin["functions"];

export type AbiFragment = {
  name: AbiFunctionName;
  functionFragment: FunctionFragment;
  inputs: ParamType[];
};

export interface ITimelockQueueTxConstantFields {
  selectedAbi: number;
  _target: string;
  _value: string;
  _timestamp: string;
}

export type ITimelockQueueTxForm = {
  [k in AbiFunctionName]?: { [k in string]: string };
} & ITimelockQueueTxConstantFields;
