import { Box } from "@mui/material";
import StratagemHeroGame from '../components/StratagemHero'
import consoleImage01 from '/img/console_01.png?url'
import consoleImage02 from '/img/console_02.png?url'
import consoleImage03 from '/img/console_03.png?url'
import consoleImage04 from '/img/console_04.png?url'
import consoleImage05 from '/img/console_05.png?url'
import consoleImage06 from '/img/console_06.png?url'
import consoleImage07 from '/img/console_07.png?url'
import consoleImage08 from '/img/console_08.png?url'
import consoleImage09 from '/img/console_09.png?url'
import { useCallback, useEffect, useRef, useState } from "react";
import OnScreenDpad from "../components/OnScreenButtons";

// const WIDTH = 510;
// const HEIGHT = 293;
const WIDTH = 1000;
const HEIGHT = WIDTH * 0.575;

function StratagemHeroConsole({ children }) {
    const screenRef = useRef();
    const [scaleFactor, setScaleFactor] = useState(1);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                // Calculate scale factor based on the dimensions of the resizable element
                const newScaleFactor = Math.min(width / WIDTH, height / HEIGHT); // Adjust as needed
                setScaleFactor(newScaleFactor);
            }
        });

        if (screenRef.current) {
            resizeObserver.observe(screenRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (<Box sx={{
        display: 'grid',
        gridTemplateColumns: "1fr 80cqw 1fr",
        gridTemplateRows: "20px 80cqh 20px",
        gridTemplateAreas: `
            "c01 c02 c03"
            "c04 c05 c06"
            "c07 c08 c09"
        `,
        // height: '50cqw',
        // width: '100cqw',
        // minWidth: '400px',
        // minHeight: '300px',
    }}>
        <Box ref={screenRef} sx={{
            gridArea: 'c05',
            display: 'flex',
            backgroundImage: `url(${consoleImage05})`,
            backgroundSize: '100% 100%',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
        }}>
            <StratagemHeroGame scale={scaleFactor} />
        </Box>
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
        <Box sx={{
            left: 0,
            bottom: 0,
            zIndex: 10000,
            position: 'fixed',
        }}>
          <OnScreenDpad />
        </Box>
    </Box>
    );
}

export default StratagemHeroConsole;