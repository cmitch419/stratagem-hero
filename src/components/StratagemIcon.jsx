import { Box, useTheme } from "@mui/material";

export const StratagemIcon = ({ icon, permitType, showBorder = true, width='3rem', height='3rem', gameModeBorder=false }) => {
    const theme = useTheme();
    const ICON_COLOR = {
        "supply": "#4eb3cf",
        "offensive": "#c94b3d",
        "defensive": "#52823e",
        "mission": "#bfa355",
    };
    const iconUrl = `${import.meta.env.BASE_URL}/img/${icon}`;
    return (
        <Box
            sx={{
                boxSizing: 'border-box',
                border: showBorder
                    ? gameModeBorder
                        ? gameModeBorder
                        : `2px solid ${permitType ? ICON_COLOR[permitType] : 'white'}`
                    : '',
                borderBottom: gameModeBorder ? 'none' : '',
                width: "100%"
            }}
        >
            {icon &&
            <Box
                sx={{
                    // backgroundImage: `url(${iconUrl})`,
                    // backgroundRepeat: "no-repeat",
                    // backgroundSize: 'cover',
                    // backgroundPosition: 'center'
                    backgroundColor: theme.palette.background.default,
                    display: 'flex',
                    alignItems: 'center'

                }}
            >
                <Box component="img" src={iconUrl} sx={{
                    width,
                    // height,
                }} />
            </Box>
                }
        </Box>
    );
}