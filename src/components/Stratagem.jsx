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

function ArrowCombo({ code, valid, inputSequence, matched, activation }) {
    const length = inputSequence?.length;
    const [timer, setTimer] = useState();
    
    useEffect(() => {
        if (matched) {
            // console.log(timer,activation)
            setTimer(activation);
            const deployTimer = setInterval(() => { if (timer > 0) setTimer(prev => prev - 1); },1000);
            return () => {
                setTimer(activation);
                clearInterval(deployTimer);
            };
        }
    }, [activation, matched]);

    return (
        <Stack direction="row">
            { matched && timer >= 0
                ? <Typography>Inbound T-{formatSeconds(timer)}</Typography>
                : code.map((c, i) => {
                    let arrowColor = 'grey';
                    if (valid) {
                        if (length < i + 1) {
                            arrowColor = 'white';
                        } else if (length === i + 1) {
                            arrowColor = 'grey';
                        } else {
                            arrowColor = 'grey';
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
    return <Box component={Forward} sx={{
        transform: `rotate(${DIRECTION_TO_ROTATION[alpha]}deg)`,
        color,
    }} />
}

export default Stratagem;
