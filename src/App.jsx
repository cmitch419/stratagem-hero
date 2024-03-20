import { useEffect } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import './App.css';
import BackgroundImage from '/img/bg01.jpg'
import ConsoleImage from '/img/console.png'
import StratagemHeroGame from './pages/StratagemHero';
import Stratagems from './pages/Stratagems';
import OnScreenDpad from './components/OnScreenButtons';

const App = () => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(min-width:600px) and (max-width:960px)');
  const isLargeScreen = useMediaQuery('(min-width:960px)');
  useEffect(() => {

  },)

  return (<Box className="App" sx={{
    backgroundImage: `url(${BackgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    height: '-webkit-fill-available'
  }}>
    <Box sx={{
      // m: '13.5% 9.21% 13.5% 9.21%',
      // m: '13.5% 13.21% 13.5% 13.21%',
      backgroundImage: `url(${ConsoleImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    }}>
      <Box sx={{

      }}>
        <StratagemHeroGame />
      </Box>
    </Box>
    <Box sx={{
      display: 'flex',
      position: 'fixed',
      left: 0,
      bottom: 0,
      zIndex: 10000,
      alignContent: 'center',
      justifyContent: 'center',
    }}>
      <OnScreenDpad />
    </Box>
    {/* <Stratagems />
    <Box position="fixed" right="1rem" bottom="1rem">
        <Typography>Hold SHIFT and press W-A-S-D</Typography>
      </Box> */}
      {/* <ToastContainer position='bottom-right' /> */}
  </Box>);
};

export default App;
