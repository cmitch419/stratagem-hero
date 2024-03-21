/* eslint-disable react/prop-types */
import { Box, List, Stack, Typography } from "@mui/material";
import { StratagemIcon } from "./StratagemIcon";

function StratagemList({ stratagems=[], }) {
    return (<List>
        {stratagems && stratagems.map((stratagem)=>{
            <StratagemLine stratagem={stratagem} />
        })}
    </List>);
}

export function StratagemLine({ stratagem }) {
    if (!stratagem) return <></>;
    const {
        name,
    } = stratagem;

    return (
        <Box padding={1} border="2px solid white" sx={{
            backgroundColor: "rgba(0,0,0,0.5)"
        }}>
            <Stack direction="row" spacing={1} alignItems="center">
                <StratagemIcon {...stratagem} />
                <Stack flex={1}>
                    <Typography variant="h6">
                        {name}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}

export default StratagemList;