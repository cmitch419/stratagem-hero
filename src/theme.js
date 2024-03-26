import { createTheme } from "@mui/material";

let theme = createTheme({
    typography: {
        root: {
        },
        fontFamily: [
            'Armata',
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
});

theme = createTheme(theme,{
    typography: {
        h3: {
            color: theme.palette.primary.main,
            textTransform: "uppercase",
            textShadow: '2px 2px rgba(0,0,0,0.7)'
        }
    }
})

export default theme;