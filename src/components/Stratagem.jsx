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
            const deployTimer = setInterval(() => {
                if (timer >= 0) setTimer(prev => prev - 1);
                else setMode(prev => {
                    if (prev >= MODES.length) {
                        return -1;
                    } else {
                        return prev+1
                    }
                })
            },1000);
            return () => {
                clearInterval(deployTimer);
            };
        } else {
            setTimer(cooldown)
        }
    },[timer]);
    return <Typography>{mode >= 0 && timer >= 0 ? `${MODES[mode]} T-${formatSeconds(timer)}` : ''}</Typography>;
}

export function ArrowCombo({ code, valid, inputSequence, matched, activation, cooldown,
    height='inherit',
    colorEntered='rgba(255,255,255,0.5)',
    colorCurrent='rgba(255,255,255,0.5)',
    colorUpcoming='rgba(255,255,255,1)',
    colorInvalid='rgba(255,0,0,1)',
    colorMatched='rgba(255,255,0,1)',
    scale=1,
}) {
    if (!code || code?.length < 0) return <></>; 
    const length = inputSequence?.length;
    
    return (
        <Stack direction="row" sx={{
            transform: `scale(${scale})`,
            height: '100%',
            // width: '100%',
        }}>
            { matched
                ? <DeploymentTimer activation={activation} cooldown={cooldown} />
                : code.map((c, i) => {
                    let arrowColor = 'grey';
                    if (valid) {
                        if (i > length-1) {
                            arrowColor = colorUpcoming;
                        } else if (i===length-1) {
                            arrowColor = colorCurrent;
                        } else {
                            arrowColor = colorEntered;
                        }
                    }
                    if (matched) {
                        arrowColor = colorMatched;
                    }
                    if (valid === false) {
                        arrowColor = colorInvalid;
                    }
                    return (<Arrow key={i} alpha={c} color={arrowColor} height={height} />);
                })}
        </Stack>
    )
}

function Arrow({ alpha, color, height }) {
    if (!alpha) return <></>;
    const SHADOW_OFFSETS = {
        'R': "1px 1px",
        'D': "1px -1px",
        'L': "-1px -1px",
        'U': "-1px 1px",
    }
    return <Box component={Forward} sx={{
        transform: `rotate(${DIRECTION_TO_ROTATION[alpha]}deg) `,
        color,
        filter: `drop-shadow(${SHADOW_OFFSETS[alpha]} 0 rgba(0,0,0,0.5))`,
        fontSize: height,
    }} />
}

export default Stratagem;
