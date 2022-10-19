import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React from "react";
import DataDisplay from "./components/DataDisplay";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DataDisplay />
    </LocalizationProvider>
  );
};

export default App;
