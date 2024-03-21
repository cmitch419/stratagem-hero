import { PlayArrowRounded, RadioButtonChecked } from "@mui/icons-material";
import { Box, IconButton, Stack } from "@mui/material";

const DpadButton = ({ kbKey, children, ...rest }) => {
    const handleKeyPress = () => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: kbKey }));
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent("keyup", { key: kbKey }));
        }, 10);
    };

    return (
        <IconButton disableTouchRipple {...rest} onClick={handleKeyPress}>
            {children}
        </IconButton>
    );
};

function OnScreenDpad() {
    return <Stack justifyContent="center" alignItems="center" sx={{
        
    }}>
        <Box sx={{
            position: 'absolute',
            boxSizing: 'border-box',
            borderRadius: '50%',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.65)',
            border: '2px solid white',
        }} />
        <DpadButton kbKey="w">
            <PlayArrowRounded sx={{ transform: 'rotate(270deg)' }} />
        </DpadButton>
        <Stack direction="row" justifyContent="center" alignItems="center">
            <DpadButton kbKey="a">
                <PlayArrowRounded sx={{ transform: 'rotate(180deg)' }} />
            </DpadButton>
            <DpadButton disabled>
                <RadioButtonChecked />
            </DpadButton>
            <DpadButton kbKey="d">
                <PlayArrowRounded />
            </DpadButton>
        </Stack>
        <DpadButton kbKey="s">
            <PlayArrowRounded sx={{ transform: 'rotate(90deg)' }} />
        </DpadButton>
    </Stack>
}

export default OnScreenDpad;