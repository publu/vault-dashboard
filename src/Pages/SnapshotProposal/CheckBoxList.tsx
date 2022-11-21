import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { GAUGE_VALID_COLLATERAL, GAUGE_VALID_COLLATERAL_V2 } from "@qidao/sdk";
import * as React from "react";

export default function CheckboxList(props: {
  choices: (GAUGE_VALID_COLLATERAL | GAUGE_VALID_COLLATERAL_V2)[];
  checked: (GAUGE_VALID_COLLATERAL | GAUGE_VALID_COLLATERAL_V2)[];
  setChecked: React.Dispatch<
    React.SetStateAction<(GAUGE_VALID_COLLATERAL | GAUGE_VALID_COLLATERAL_V2)[]>
  >;
}) {
  const { choices, checked, setChecked } = props;
  const handleToggle =
    (value: GAUGE_VALID_COLLATERAL | GAUGE_VALID_COLLATERAL_V2) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setChecked(newChecked);
    };

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {choices.map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={value.vaultAddress} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={handleToggle(value)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.snapshotName}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
