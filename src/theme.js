import { createTheme } from "@mui/material";

export const hd2ThemeOptions = {
    typography: {
        root: {
            textTransform: "uppercase"
        },
        fontFamily: [
            'LT Binary Neue',
            'Uni Sans Demo',
            'sans-serif',
        ].join(','),
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffed26',
        },
        secondary: {
            main: '#ff9100',
        },
        error: {
            main: '#d32f2f',
        },
    },
};

const theme = createTheme({
    ...hd2ThemeOptions,
});

export default theme;