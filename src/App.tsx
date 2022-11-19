import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React from "react";
import Routes from "./Pages/Routes";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Routes />
    </LocalizationProvider>
  );
};

export default App;
