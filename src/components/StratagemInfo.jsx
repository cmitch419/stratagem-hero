import { Box, Stack, Typography } from "@mui/material";

const STRATAGEM_INFO_BASE = {
    display: 'grid',
    gridTemplateRows: 'auto',
    textWrap: 'wrap',
};

const STRATAGEM_INFO = {
    ...STRATAGEM_INFO_BASE,
    gap: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    gridTemplateColumns: '100%',
    gridTemplateAreas:
        `"stratagemInfo1"
        "stratagemInfo2"`
};

const STRATAGEM_INFO_1 = {
    ...STRATAGEM_INFO_BASE,
    gridTemplateColumns: '1rem 1fr',    
    gridTemplateAreas:
        `"vert  category"
        "vert   name"
        "vert   desc"`,
    
};

const STRATAGEM_INFO_2 = {
    ...STRATAGEM_INFO_BASE,
    display: 'grid',
    gap: 1,
    gridTemplateRows: 'auto',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateAreas:  `"stats traits"`
};

export function StratagemInfo({ stratagem }) {
    if (!stratagem) return <></>;
    let {
        permitType,
        description,
        name,
        model,
        uses,
        activation,
        cooldown,
        traits,
    } = stratagem;

    return (<Box sx={{
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 1,
        border: "2px solid white",
        ...STRATAGEM_INFO,
    }}>
        <Box sx={{
            gridArea: "stratagemInfo1",
            padding: 1,
            ...STRATAGEM_INFO_1,
        }}>
            <Box sx={{ gridArea: 'vert', width: '20px', borderLeft: "6px solid yellow"}}></Box>
            <Box flex={1}sx={{ gridArea: 'category' }}>
                <Typography flex={1} variant="h6">{permitType ? `${permitType} ` : ''}Stratagem Permit</Typography>
            </Box>
            <Box sx={{ gridArea: 'name' }}>
                <Typography flex={1} variant="h4" fontWeight={600}>{model ? `${model} ` : ''}{name}</Typography>
            </Box>
            <Box sx={{ gridArea: 'desc' }}>
                <Typography flex={1} textTransform="none">{description ? description : 'No description provided.'}</Typography>
            </Box>
        </Box>
        <Box padding={1} sx={{
            gridArea: "stratagemInfo2",
            ...STRATAGEM_INFO_2
        }}>
            <Box component="fieldset" sx={{ gridArea: 'stats', border: "2px solid white", p: 1 }}>
                <Box component="legend">Stats</Box>
                <Stack alignItems="flex-start">
                    <Stack width="100%" direction="row" alignItems="center" justifyContent="space-between">
                        <Typography>
                            Call-in time:
                        </Typography>
                        <Typography>
                            {activation === 0 ? 'Immediate' : activation ? `${activation} sec` : ''}
                        </Typography>
                    </Stack>
                    <Stack width="100%" direction="row" alignItems="center" justifyContent="space-between">
                        <Typography>
                            Uses:
                        </Typography>
                        <Typography>
                            {uses === -1 ? 'Unlimited' : uses}
                        </Typography>
                    </Stack>
                    <Stack width="100%" direction="row" alignItems="center" justifyContent="space-between">
                        <Typography>
                            Cooldown Time:
                        </Typography>
                        <Typography>
                            {cooldown !== null && `${cooldown} sec`}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
            <Box component="fieldset" sx={{ gridArea: 'traits', border: "2px solid white", p: 1 }}>
                <Box component="legend">Stratagem Traits</Box>
                <Stack>
                    {traits && traits.map((trait, i) =>
                        <Typography key={i}>
                            | {trait}
                        </Typography>)}
                </Stack>
            </Box>
        </Box >
    </Box>);
}

export default StratagemInfo;