/* eslint-disable react/prop-types */
import { Box, Stack, Typography } from "@mui/material"
import { Forward } from "@mui/icons-material";
import { DIRECTION_TO_ROTATION } from "../constants";


const STRATAGEM_INFO_BASE = {
    display: 'grid',
    gridTemplateRows: 'auto',
};

const STRATAGEM_INFO = {
    ...STRATAGEM_INFO_BASE,
    gap: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gridTemplateAreas:
        `"stratagemInfo1"
        "stratagemInfo2"`
};

const STRATAGEM_INFO_1 = {
    ...STRATAGEM_INFO_BASE,
    gridTemplateColumns: '1rem, repeat(4, 1fr)',
    gridTemplateAreas:
        `"vert  category  category    category    category"
        "vert   name      name        name        name"
        "vert   desc      desc        desc        desc"`
};

const STRATAGEM_INFO_2 = {
    ...STRATAGEM_INFO_BASE,
    display: 'grid',
    gap: 1,
    gridTemplateRows: 'auto',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateAreas:  `"stats traits"`
};

function Stratagem({
    stratagem,
    valid,
    inputSequence,
    matched,
}) {
    const {
        name,
        code,
    } = stratagem;

    return (
        <Box padding={1} border="2px solid white" sx={{
            backgroundColor: "rgba(0,0,0,0.5)"
        }}>
            <Stack direction="row" spacing={1} alignItems="center">
                <StratagemIcon {...stratagem} />
                <Stack flex={1}>
                    <Typography variant="h6">
                        {name?.toUpperCase()}
                    </Typography>
                    <ArrowCombo code={code} valid={valid} inputSequence={inputSequence} matched={matched} />
                </Stack>
            </Stack>
        </Box>
    );
}

export function ArrowCombo({ code, valid, inputSequence, matched }) {
    const length = inputSequence?.length;
    return (
        <Stack direction="row">
            {code.map((c, i) => {
                let arrowColor = 'grey';
                if (valid) {
                    if (length < i + 1) {
                        arrowColor = 'lightgray';
                    } else if (length === i + 1) {
                        arrowColor = 'yellow';
                    } else {
                        arrowColor = 'gray';
                    }
                }
                if (matched) {
                    arrowColor = 'white';
                }
                return (<Arrow key={i} alpha={c} color={arrowColor} />)

            })}
        </Stack>
    )
}

function Arrow({ alpha, color }) {
    return <Box component={Forward} sx={{
        transform: `rotate(${DIRECTION_TO_ROTATION[alpha]}deg)`,
        color,
    }} />
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
                        {name?.toUpperCase()}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}

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

    return (<Box padding={1} border="2px solid white" sx={{
        backgroundColor: "rgba(0,0,0,0.5)",
        ...STRATAGEM_INFO
    }}>
        <Box padding={1} sx={{
            gridArea: "stratagemInfo1",
            ...STRATAGEM_INFO_1
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

const StratagemIcon = ({ icon, permitType }) => {
    const ICON_COLOR = {
        "supply": "#4eb3cf",
        "offensive": "#c94b3d",
        "defensive": "#52823e",
        "mission": "#bfa355",
    };
    return (<Box border={`2px solid ${permitType ? ICON_COLOR[permitType] : 'white'}`} height="3rem" width="3rem">
    {icon && <Box display="block" height="inherit" maxWidth="100%" component="img" src={`./img/${icon}`} />}
</Box>)
}

export default Stratagem;
