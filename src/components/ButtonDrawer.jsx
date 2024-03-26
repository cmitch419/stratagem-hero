import { Checklist, Gamepad, GamepadOutlined, List, Settings } from "@mui/icons-material";
import { Box, IconButton, Stack, Zoom } from "@mui/material";
import { PAGES } from "../constants";

function ButtonDrawer({ page, setPage }) {
    return (
        <Stack
            sx={{
                position: 'fixed',
                bottom: '5px',
                right: '5px',
                zIndex: 10000,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(3px)',
            }}>
            <IconButton onClick={() => setPage(PAGES.CONFIGURATION)} sx={{ border: 'none' }} >
                <Settings color={page===PAGES.CONFIGURATION ? 'primary': ''}/>
            </IconButton>
            <IconButton onClick={() => setPage(PAGES.STRATAGEM_LIST)} sx={{ border: 'none' }} >
                <Checklist color={page===PAGES.STRATAGEM_LIST ? 'primary': ''}/>
            </IconButton>
            <IconButton onClick={() => setPage(PAGES.GAME)} sx={{ border: 'none' }} >
                <GamepadOutlined color={page===PAGES.GAME ? 'primary': ''}/>
            </IconButton>
        </Stack>
    )
}

export default ButtonDrawer;