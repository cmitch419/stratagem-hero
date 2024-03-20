import { useEffect } from 'react';
import { Box } from '@mui/material';
import './App.css';
import BackgroundImage from '/img/bg01.jpg'
import ConsoleImage from '/img/console.png'
import StratagemHero from './components/StratagemHero';
import OnScreenDpad from './components/OnScreenButtons';

const App = () => {
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
      <StratagemHero />
    </Box>
    <Box sx={{
      display: 'flex',
      position: 'fixed',
      left: 0,
      bottom: 0,
      zIndex: 10000,
      alignContent: 'center',
      justifyContent: 'center',
      transform: 'scale(200%) translate(50%,-50%)'
    }}>
      <OnScreenDpad />
    </Box>
    {/* <Stratagems /> */}
    {/* <Box position="fixed" right="1rem" bottom="1rem">
        <Typography>Hold SHIFT and press W-A-S-D</Typography>
      </Box>
      <ToastContainer position='bottom-right' /> */}
  </Box>);
};

export default App;
