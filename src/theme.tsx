import { createTheme } from '@mui/material/styles';
import { extendTheme } from '@mui/joy/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
export const materialTheme = createTheme({
    palette: {
        primary: {
            main: '#fff',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
    },
});

export const joyTheme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    solidBg: '#1976d2',
                    // Define other variants if needed
                },
                // Define other colors similarly
            },
        },
    },
});
