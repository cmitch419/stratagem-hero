import { PlayArrowRounded } from "@mui/icons-material";
import { Box, IconButton, Stack } from "@mui/material";

const DpadButton = ({ kbKey, rotate=0, children, ...rest }) => {
    const handleKeyPress = () => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: kbKey }));
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent("keyup", { key: kbKey }));
        }, 10);
    };

    return (
        <IconButton
            disableRipple
            sx={{
                boxSizing: 'border-box',
                borderRadius: 'unset',
                borderLeft: '1px solid rgba(255,255,255,0.25)',
                borderBottom: '1px solid rgba(255,255,255,0.25)',
                transform: `rotate(${rotate*90}deg)`,
            }}
            onClick={handleKeyPress}
            {...rest}
        >
            { children ?? <PlayArrowRounded sx={{ transform: 'rotate(-45deg) translate(-15%,0%)' }} /> }
        </IconButton>
    );
};

export function OnScreenDpad() {
    return <Stack justifyContent="center" alignItems="center" sx={{
        boxShadow: '0.2rem 0.2rem 0.2rem rgba(0,0,0,0.7)',
        borderRadius: '50%',
        transform: `rotate(45deg)`,
    }}>
        <Box sx={{
            position: 'absolute',
            boxSizing: 'border-box',
            borderRadius: '50%',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: '2px solid white',
            backdropFilter: 'blur(1px)'
        }} />
        <Stack direction="row" justifyContent="center" alignItems="center">
            <DpadButton kbKey="w" rotate={3}/>
            <DpadButton kbKey="d" />
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center">
            <DpadButton kbKey="a" rotate={2}/>
            <DpadButton kbKey="s" rotate={1} />
        </Stack>
    </Stack >
}

export default OnScreenDpad;