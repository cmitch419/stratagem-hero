import { createTheme } from "@mui/material";

let theme = createTheme({
    typography: {
        allVariants: {
            textTransform: 'uppercase',
            textShadow: '1px 1px rgba(0,0,0,0.5)'
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
            textShadow: '2px 2px rgba(0,0,0,0.5)'
        },
        h6: {
            color: theme.palette.primary.main,
        }
    }
})

export default theme;