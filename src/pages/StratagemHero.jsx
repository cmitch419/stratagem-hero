import { Box, Stack } from "@mui/material";
import StratagemHeroGame from "../components/StratagemHero";
import consoleImage01 from '/img/console_01.png?url'
import consoleImage02 from '/img/console_02.png?url'
import consoleImage03 from '/img/console_03.png?url'
import consoleImage04 from '/img/console_04.png?url'
import consoleImage05 from '/img/console_05.png?url'
import consoleImage06 from '/img/console_06.png?url'
import consoleImage07 from '/img/console_07.png?url'
import consoleImage08 from '/img/console_08.png?url'
import consoleImage09 from '/img/console_09.png?url'
import { useEffect, useRef, useState } from "react";

function StratagemHero({ children }) {
    const screenRef = useRef();
    return (<Box sx={{
        display: 'grid',
        gridTemplateColumns: "85px 1fr 85px",
        gridTemplateRows: "61px 1fr 60px",
        gridTemplateAreas: `
            "c01 c02 c03"
            "c04 c05 c06"
            "c07 c08 c09"
        `,
        height: '100%',
        width: '100%',
    }}>
        <Box sx={{
            gridArea: 'c01',
            backgroundImage: `url(${consoleImage01})`,
            backgroundSize: '100% 100%',
        }} />
        <Box sx={{
            gridArea: 'c02',
            backgroundImage: `url(${consoleImage02})`,
            backgroundSize: '100% 100%',
        }} />
        <Box sx={{
            gridArea: 'c03',
            backgroundImage: `url(${consoleImage03})`,
            backgroundSize: '100% 100%',
        }} />
        <Box sx={{
            gridArea: 'c04',
            backgroundImage: `url(${consoleImage04})`,
            backgroundSize: '100% 100%',
        }} />
        <Box ref={screenRef} sx={{
            gridArea: 'c05',
            backgroundImage: `url(${consoleImage05})`,
            backgroundSize: '100% 100%',
        }}>
            {children}
        </Box>
        <Box sx={{
            gridArea: 'c06',
            backgroundImage: `url(${consoleImage06})`,
            backgroundSize: '100% 100%',
        }} />
        <Box sx={{
            gridArea: 'c07',
            backgroundImage: `url(${consoleImage07})`,
            backgroundSize: '100% 100%',
        }} />
        <Box sx={{
            gridArea: 'c08',
            backgroundImage: `url(${consoleImage08})`,
            backgroundSize: '100% 100%',
        }} />
        <Box sx={{
            gridArea: 'c09',
            backgroundImage: `url(${consoleImage09})`,
            backgroundSize: '100% 100%',
        }} />
        </Box>
        );
}

export default StratagemHero;