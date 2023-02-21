import { createTheme } from '@mui/material/styles'
import { defaultTheme } from 'react-admin'

export const theme = createTheme({
    ...defaultTheme,
    palette: {
        mode: 'dark',
    },
})
