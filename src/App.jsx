import { useEffect, useState } from 'react';
import { AppBar, Box, Drawer, IconButton, Toolbar, Zoom } from '@mui/material';
import './App.css';
import BackgroundImage from '/img/bg01.jpg'
import StratagemHeroConsole from './pages/StratagemHeroConsole';
import Stratagems from './pages/Stratagems';
import { Close, GamepadOutlined } from '@mui/icons-material';
import OnScreenDpad from './components/OnScreenButtons';

const App = () => {
    const [showGame, setShowGame] = useState(true);

    const [disabledStratagems, setDisabledStratagems] = useState([]);

    const toggleGameDrawer = () => setShowGame(!showGame);

    useEffect(()=>{
        console.log(disabledStratagems);
    },[disabledStratagems]);

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
                disabledStratagems={disabledStratagems}
                setDisabledStratagems={setDisabledStratagems}
            />
        </Box>
        <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
        }}>
            <IconButton onClick={toggleGameDrawer}>
                <GamepadOutlined />
            </IconButton>
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
            <Box sx={{
                position: 'fixed',
                top: 0,
                right: 0,
            }}>
                <IconButton onClick={() => setShowGame(false)}>
                    <Close />
                </IconButton>
            </Box>

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


    </Box >);
};

export default App;
