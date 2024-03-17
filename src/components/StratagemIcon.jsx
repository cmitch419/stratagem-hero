import { Box } from "@mui/material";

export const StratagemIcon = ({ icon, permitType, showBorder = true }) => {
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
                border: showBorder
                    ? `2px solid ${permitType ? ICON_COLOR[permitType] : 'white'}`
                    : '',
                height: '3rem',
                width: '3rem',
            }}
        >
            {icon &&
            <Box
                sx={{
                    display: 'block',
                    height: 'inherit',
                    maxWidth: '100%',
                    component: 'img',
                    src: {iconUrl},
                }}
            />}
        </Box>
    );
}