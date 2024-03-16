/* eslint-disable react/prop-types */
/**
 *   {
      "categories": [
          "Offensive",
          "Eagle"
      ],
      "icon": "EagleClusterbombicon.png",
      "name": "Eagle Cluster Bomb",
      "code": [
          "U",
          "R",
          "D",
          "D",
          "R"
      ],
      "cooldown": 8,
      "uses": 4,
      "activation": 3
  },
 */

import { Box, Stack, Typography } from "@mui/material"
import { Forward } from "@mui/icons-material";
import { ALPHA_TO_ROTATION } from "../constants";

function Stratagem({
    stratagem,
    valid,
    inputSequence,
    matched,
}) {
    const {
        icon,
        name,
        code,
    } = stratagem;

    return (
        <Box padding={1} border="2px solid white">
            <Stack direction="row" spacing={1} alignItems="center">
                <Box border="2px solid" height="3rem" width="3rem">
                    { icon && <Box display="block" height="inherit" maxWidth="100%" component="img" src={`./img/${icon}`} /> }
                </Box>
                <Stack flex={1}>
                    <Typography variant="h6">
                        {name?.toUpperCase()}
                    </Typography>
                    <ArrowCombo code={code} valid={valid} inputSequence={inputSequence} matched={matched} />
                </Stack>
            </Stack>
        </Box>
    )
}

export function ArrowCombo({ code, valid, inputSequence, matched }) {
    const length = inputSequence?.length;
    return (
        <Stack direction="row">
            {code.map((c, i) => {
                let arrowColor = 'grey';
                if (valid) {
                    if (length < i + 1) {
                        arrowColor = 'darkgrey';
                    } else if (length === i + 1) {
                        arrowColor = 'greenyellow';
                    } else {
                        arrowColor = 'yellow';
                    }
                }
                if (matched) {
                    arrowColor = 'yellow';
                }
                return (<Arrow key={i} alpha={c} color={arrowColor} />)

            })}
        </Stack>
    )
}

function Arrow({ alpha, color }) {
    return <Box component={Forward} sx={{
        transform: `rotate(${ALPHA_TO_ROTATION[alpha]}deg)`,
        color,
    }} />
}

export function StratagemInfo({ stratagem }) {
    const {
        permitTypes = [],
        description = 'ERROR: Description information missing.',
        name,
        uses = uses === -1 ? 'Unlimited' : uses,
        activation = activation === 0 ? 'Immediate' : activation,
        cooldown = 'N/A',
        traits = [],
    } = stratagem;

    return (
        <Box padding={1} border="2px solid white">
            <Stack>
                <Typography variant="h6">{permitTypes.length > 0 ? `${permitTypes.join(' ')} ` : ''}Stratagem Permit</Typography>
                <Typography variant="h4">{name}</Typography>
                <Typography>{description}</Typography>

                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                    <Box>
                        <Stack alignItems="flex-start">
                            {activation && <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography>
                                    Call-in time:
                                </Typography>
                                <Typography>
                                    {activation}
                                </Typography>
                            </Stack>}
                            {uses && <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography>
                                    Uses:
                                </Typography>
                                <Typography>
                                    {uses}
                                </Typography>
                            </Stack>}
                            {cooldown && <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography>
                                    Cooldown Time:
                                </Typography>
                                <Typography>
                                    {cooldown} sec
                                </Typography>
                            </Stack>}
                        </Stack>

                    </Box>

                    <Box height="100%">
                        <Stack alignItems="flex-start">
                            {traits && traits.map((trait, i) =>
                                <Typography key={i}>
                                    | {trait}
                                </Typography>)}
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
        </Box >
    )
}

export default Stratagem