import * as React from "react";
import { AppBar } from "react-admin";
import { NetworkButton } from "./MetaMaskConnectButton";

export const MyAppBar: React.FC = (props) => (
  <AppBar
    sx={{
      "& .RaAppBar-title": {
        flex: 1,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      },
    }}
    {...props}
  >
    <div style={{ marginLeft: "auto" }}>
      <NetworkButton title={"Metamask"} />
    </div>
  </AppBar>
);
