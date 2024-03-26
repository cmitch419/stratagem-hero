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

const App = () => {
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
        <Zoom in={page === PAGES.GAME}>
            <Box sx={{
                left: '1.5em',
                bottom: '1.5em',
                position: 'fixed',
                boxShadow: '0.2rem 0.2rem 0.2rem rgba(0,0,0,0.7)',
                borderRadius: '50%',
                zIndex: 10000,
            }}>
                <OnScreenDpad />
            </Box>
        </Zoom>
        <ButtonDrawer page={page} setPage={setPage} />


    </Box >);
};

export default App;
