import { ChainId } from "@qidao/sdk";
import { get } from "lodash";
import { RaRecord, useRecordContext } from "react-admin";
import { shortenHex } from "../../utils/addresses";
import { getExplorerLink } from "../../utils/explorer";

export const OnChainHexField = ({
  source,
  addressType,
}: {
  source: string;
  addressType: "address" | "token" | "block" | "transaction";
}) => {
  const record = useRecordContext<RaRecord & { chainId: ChainId }>();
  const hexValue = get(record, source);
  return record ? (
    <a
      href={getExplorerLink(record.chainId, hexValue, addressType)}
      target="_blank"
      rel="noreferrer"
    >
      <span>{shortenHex(hexValue)}</span>
    </a>
  ) : null;
};

OnChainHexField.defaultProps = { label: "Name" };
