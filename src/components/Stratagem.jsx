/* eslint-disable react/prop-types */
import { Box, Stack, Typography } from "@mui/material"
import { Forward } from "@mui/icons-material";
import { DIRECTION_TO_ROTATION } from "../constants";
import { StratagemIcon } from "./StratagemIcon";
import { useEffect, useState } from "react";
import { formatSeconds } from "../functions/helpers";

function Stratagem({
    stratagem,
    valid,
    inputSequence,
    matched,
}) {
    return (
        <Box sx={{
            minWidth: "450px",
        }}>
            <Stack direction="row" alignItems="center">
                <StratagemIcon {...stratagem} />
                <Stack sx={{
                    flex: 1,
                    pl: "1rem",
                }}>
                    <Typography variant="h6">
                        {stratagem.name}
                    </Typography>
                    <ArrowCombo
                        {...stratagem}
                        valid={valid}
                        inputSequence={inputSequence}
                        matched={matched} 
                    />
                </Stack>
            </Stack>
        </Box>
    );
}

function DeploymentTimer ({ activation, cooldown }) {
    const [mode, setMode] = useState(0);
    const [timer, setTimer] = useState(activation);
    const MODES = [
        'DEPLOYING',
        'COOLDOWN',
    ];

    useEffect(() => {
        if (timer > 0) {
            const deployTimer = setInterval(() => { if (timer >= 0) setTimer(prev => prev - 1); },1000);
            return () => {
                clearInterval(deployTimer);
            };
        } else {
            setTimer(cooldown)
        }
    },[timer]);
    return <Typography>{timer >= 0 ? `DEPLOYING T-${formatSeconds(timer)}` : 'COOLDOWN'}</Typography>;
}

function ArrowCombo({ code, valid, inputSequence, matched, activation, cooldown }) {
    const length = inputSequence?.length;
    
    return (
        <Stack direction="row">
            { matched
                ? <DeploymentTimer activation={activation} cooldown={cooldown} />
                : code.map((c, i) => {
                    let arrowColor = 'grey';
                    if (valid) {
                        if (length < i + 1) {
                            arrowColor = 'rgba(255,255,255,1)';
                        } else if (length === i + 1) {
                            arrowColor = 'rgba(255,255,255,0.5)';
                        } else {
                            arrowColor = 'rgba(255,255,255,0.5)';
                        }
                    }
                    if (matched) {
                        arrowColor = 'yellow';
                    }
                    return (<Arrow key={i} alpha={c} color={arrowColor} />);
                })}
        </Stack>
    )
}

function Arrow({ alpha, color }) {
    const SHADOW_OFFSETS = {
        'R': "1px 1px",
        'D': "1px -1px",
        'L': "-1px -1px",
        'U': "-1px 1px",
    }
    return <Box component={Forward} sx={{
        transform: `rotate(${DIRECTION_TO_ROTATION[alpha]}deg)`,
        color,
        filter: `drop-shadow(${SHADOW_OFFSETS[alpha]} 0 rgba(0,0,0,0.5))`
    }} />
}

export default Stratagem;
