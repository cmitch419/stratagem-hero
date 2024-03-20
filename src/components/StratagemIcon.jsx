import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";

export const StratagemIcon = ({ icon, permitType, showBorder = true, width='3rem', height='3rem', gameModeBorder=false }) => {
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
                height,
                width,
            }}
        >
            {icon &&
            <Box
                sx={{
                    display: 'block',
                    height: '100%',
                    backgroundImage: `url(${iconUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'

                }}
            />}
        </Box>
    );
}