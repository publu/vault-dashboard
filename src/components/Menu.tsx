import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BallotIcon from "@mui/icons-material/Ballot";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import * as React from "react";
import * as RA from "react-admin";

export const MyMenu = (props: JSX.IntrinsicAttributes & RA.MenuProps) => (
  <RA.Menu {...props}>
    <RA.Menu.Item
      to="/vaults"
      primaryText="Vault Admin"
      leftIcon={<AccountBalanceIcon />}
    />
    <RA.Menu.Item
      to="/treasury-admin"
      primaryText="Treasury Admin"
      leftIcon={<CurrencyBitcoinIcon />}
    />
    <RA.Menu.Item
      to="/snapshot-proposal"
      primaryText="Snapshot Proposal"
      leftIcon={<BallotIcon />}
    />
    {/*<RA.Menu.Item to="/users" primaryText="Users" leftIcon={<PeopleIcon />}/>*/}
    {/*<RA.Menu.Item to="/custom-route" primaryText="Miscellaneous" leftIcon={<LabelIcon />}/>*/}
  </RA.Menu>
);
