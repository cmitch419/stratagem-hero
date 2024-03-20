import { PlayArrowRounded, RadioButtonChecked } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";

const DpadButton = ({ kbKey, children, ...rest }) => {
    const handleKeyPress = () => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: kbKey }));
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent("keyup", { key: kbKey }));
        }, 50);
    };

    return (
        <IconButton disableTouchRipple {...rest} onClick={handleKeyPress}>
            {children}
        </IconButton>
    );
};

function OnScreenDpad() {
    return <Stack justifyContent="center" alignItems="center">
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