import { Box, Stack } from "@mui/material";
import { StratagemIcon } from "./StratagemIcon";

function StratagemDrawer({ stratagems, selectedIndex, setSelectedIndex }) {
    return (
        <Stack
            direction="row"
            justifyContent="space-evenly"
            sx={{
                background: 'rgba(0,0,0,0.5)',
                p: 2,
            }}        >
            { stratagems.map((stratagem,index) => {
                return (
                <Box
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    sx={{
                        display: 'flex',
                        border: '1px dotted white'
                    }}>
                    <StratagemIcon
                        {...stratagem}
                        showBorder={selectedIndex === index}
                    />
                </Box>
            )})}
        </Stack>
    )
}

export default StratagemDrawer;