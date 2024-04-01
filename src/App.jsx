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

const TransparentDrawer = ({children, ...rest}) => <Drawer
    PaperProps={{
        sx: {
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(0.25rem)',
        }
    }}
    {...rest}> {children} </Drawer>

const App = () => {
    const { getConfig } = useGameConfig();

    const [page, setPage] = useState(PAGES.STRATAGEM_LIST);
    const [disabledStratagems, setDisabledStratagems] = useState(new Set());

    useEffect(()=>{
        setPage(PAGES.GAME);
    },[]);

    // @TODO: Clean up and lift to components
    return (<Box component="div" className="App" sx={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}>
        <TransparentDrawer
            anchor="top"
            open={page === PAGES.STRATAGEM_LIST}
            PaperProps={{
                sx: {
                    background: 'rgba(0,0,0,0)'
                }
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
        </TransparentDrawer>

        <TransparentDrawer
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

        </TransparentDrawer>
        <TransparentDrawer
            anchor="top"
            open={page === PAGES.CONFIGURATION}
            sx={{
                width: '100%',
                height: '100%'
            }}
        >
            <Configuration />

        </TransparentDrawer>
        <Box sx={{
            // left: `${gameConfig.dpadPositionX}rem`,
            // bottom: `${gameConfig.dpadPositionY}rem`,
            left: 0,
            bottom: 0,
            position: 'absolute',
            zIndex: 10000,
            transform: `scale(${getConfig().dpadScale}) translate(50%,-50%)`
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
