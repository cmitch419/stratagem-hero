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
import { useEffect } from "react";

function Stratagem({ stratagem, isStillValid, inputSequence }) {
    const { categories, icon, name, code, cooldown, uses, activation } = stratagem;
    useEffect(() => {
        
    },[]);
    return (
        // <Card sx={{ display: 'flex' }}>
        <Stack direction="row" spacing={1} alignItems="center">
            <Box component="img" src={`./img/${icon}`} />
            <Stack flex={1}>
                <Typography variant="h6" fontFamily={"unset"}>
                    {name?.toUpperCase()}
                </Typography>
                <ArrowCombos code={code} isStillValid={isStillValid} inputSequence={inputSequence} />
            </Stack>
        </Stack>
        // </Card>
    )
}

export function ArrowCombos({ code, isStillValid, inputSequence }) {
    const length = inputSequence?.length;
    return (<Stack direction="row">
        {code.map((c, i) => {
            let arrowColor = 'grey';
            if (isStillValid) {
                if (length < i + 1) {
                    arrowColor = 'darkgrey';
                } else if (length === i + 1) {
                    arrowColor = 'greenyellow';
                } else {
                    arrowColor = 'yellow';
                }
            }
            return (<Arrow alpha={c} color={arrowColor} />)

        })}
    </Stack>
    )
}

function Arrow({ alpha, color }) {
    const ALPHA_TO_ROTATION = {
        'R': 0,
        'D': 90,
        'L': 180,
        'U': 270,
    };
    return <Box component={Forward} sx={{
        transform: `rotate(${ALPHA_TO_ROTATION[alpha]}deg)`,
        color,
    }} />
}

export default Stratagem