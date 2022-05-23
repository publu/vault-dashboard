import {defaultTheme} from "react-admin";
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    ...defaultTheme,
    palette: {
        mode: 'dark',
    },
});