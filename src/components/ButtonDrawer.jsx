import { Checklist, GamepadOutlined, Settings, VolumeMute, VolumeOff, VolumeUp } from "@mui/icons-material";
import { Divider, IconButton, Stack } from "@mui/material";
import { PAGES } from "../constants";
import useGameSound from "../hooks/useGameSound";

function ButtonDrawer({ page, setPage }) {
    const { isMuted, handleToggleMute } = useGameSound();
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
            <IconButton onClick={handleToggleMute} sx={{ border: 'none' }} >
                { isMuted
                    ? <VolumeOff color="secondary" />
                    : <VolumeUp color="secondary" />
                }
            </IconButton>
            <Divider />
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