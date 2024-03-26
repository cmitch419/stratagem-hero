import { useEffect, useState } from 'react';
import { Box, Drawer, Zoom } from '@mui/material';
import './App.css';
import BackgroundImage from '/img/bg01.jpg';
import StratagemHeroConsole from './pages/StratagemHeroConsole';
import Stratagems from './pages/Stratagems';
import { OnScreenDpad } from './components/OnScreenButtons';
import stratagemsDataV2 from './data/stratagemsData';
import ButtonDrawer from './components/ButtonDrawer';
import { PAGES } from './constants';
import Configuration from './components/Configuration';
import useGameConfig from './hooks/useGameConfig';

const App = () => {
    const { gameConfig } = useGameConfig();

    const [page, setPage] = useState(PAGES.STRATAGEM_LIST);
    const [disabledStratagems, setDisabledStratagems] = useState(new Set());

    useEffect(()=>{
        setPage(PAGES.GAME);
    },[]);

    // @TODO: Clean up and lift to components
    return (<Box className="App" sx={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}>
        <Drawer
            anchor="top"
            open={page === PAGES.STRATAGEM_LIST}
            sx={{

            }}
        >
            <Box sx={{
            }}>
                <Stratagems
                    stratagemsData={stratagemsDataV2}
                    disabledStratagems={disabledStratagems}
                    setDisabledStratagems={setDisabledStratagems}
                />
            </Box>
        </Drawer>

        <Drawer
            anchor="top"
            open={page === PAGES.GAME}
            sx={{
                width: '100%',
                height: '100%'
            }}
        >
            <StratagemHeroConsole
                disabledStratagems={disabledStratagems}
            />

        </Drawer>
        <Drawer
            anchor="top"
            open={page === PAGES.CONFIGURATION}
            sx={{
                width: '100%',
                height: '100%'
            }}
        >
            <Configuration />

        </Drawer>
        <Box sx={{
            left: '2.5em',
            bottom: '2.5em',
            position: 'absolute',
            zIndex: 10000,
            transform: `scale(${gameConfig.dpadScale})`
        }}>
            <Zoom in={page === PAGES.GAME}>
                <Box>
                    <OnScreenDpad />
                </Box>
            </Zoom>
        </Box>
        <ButtonDrawer page={page} setPage={setPage} />


    </Box >);
};

export default App;
