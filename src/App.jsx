import { useEffect, useState } from 'react';
import { Box, Drawer, IconButton, Zoom } from '@mui/material';
import './App.css';
import BackgroundImage from '/img/bg01.jpg';
import StratagemHeroConsole from './pages/StratagemHeroConsole';
import Stratagems from './pages/Stratagems';
import { Checklist, GamepadOutlined } from '@mui/icons-material';
import OnScreenDpad from './components/OnScreenButtons';
import stratagemsDataV2 from './data/stratagemsData';

const App = () => {
    const [showGame, setShowGame] = useState(true);

    const [disabledStratagems, setDisabledStratagems] = useState(new Set());

    const toggleGameDrawer = () => setShowGame(!showGame);

    // useEffect(()=>{
    //     console.log(disabledStratagems);
    // },[disabledStratagems]);

    // @TODO: Clean up and lift to components
    return (<Box className="App" sx={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        overflowY: 'hidden',
    }}>
        <Box sx={{
            width: '100vw',
            height: '100vh',
            overflowY: 'hidden',
        }}>
            <Stratagems
                stratagemsData={stratagemsDataV2}
                disabledStratagems={disabledStratagems}
                setDisabledStratagems={setDisabledStratagems}
            />
        </Box>

        <Drawer
            anchor="top"
            open={showGame}
            sx={{
                width: '100%',
                height: '100%'
            }}
        >
            <StratagemHeroConsole
                disabledStratagems={disabledStratagems}
            />

        </Drawer>
        <Zoom in={showGame}>
            <Box sx={{
                left: '1rem',
                bottom: '1rem',
                zIndex: 10000,
                position: 'fixed',
                boxShadow: '0.2rem 0.2rem 0.2rem rgba(0,0,0,0.7)',
                borderRadius: '50%',
            }}>
                <OnScreenDpad />
            </Box>
        </Zoom>
        <Zoom in={!showGame}>
            <Box sx={{
                position: 'fixed',
                bottom: '1rem',
                right: '1rem',
            }}>
                <IconButton onClick={toggleGameDrawer}>
                    <GamepadOutlined />
                </IconButton>
            </Box>
        </Zoom>
        <Zoom in={showGame}>
            <Box sx={{
                position: 'fixed',
                bottom: '1rem',
                right: '1rem',
                zIndex: 10000,
            }}>
                <IconButton onClick={toggleGameDrawer}>
                    <Checklist />
                </IconButton>
            </Box>
        </Zoom>


    </Box >);
};

export default App;
