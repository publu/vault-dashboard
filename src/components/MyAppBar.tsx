import Typography from "@mui/material/Typography";
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
      <Typography variant="h6" color="inherit" id="react-admin-title" />
      <NetworkButton title={"Metamask"} />
    </div>
  </AppBar>
);
